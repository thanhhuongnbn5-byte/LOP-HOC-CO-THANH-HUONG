import fs from 'fs';
import path from 'path';

const REPO_OWNER = 'thanhhuongnbn5-byte';
const REPO_NAME = 'LOP-HOC-CO-THANH-HUONG';
const BRANCH = 'main';

const token = process.argv[2] || process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Vui lòng cung cấp GitHub Personal Access Token (PAT)!');
  process.exit(1);
}

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const headers = {
  'Authorization': `token ${token}`,
  'User-Agent': 'EduNBN-Deployer',
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

    if (
      relPath.startsWith('node_modules') || 
      relPath.startsWith('dist') || 
      relPath.startsWith('.git') || 
      relPath.startsWith('.agent') || 
      relPath === '.env' ||
      relPath.endsWith('.zip') ||
      relPath.endsWith('.exe')
    ) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(relPath);
    }
  });
  return fileList;
};

async function uploadFile(filePath, retries = 3) {
  const content = fs.readFileSync(filePath, 'base64');
  const apiUrl = `${API_BASE}/contents/${filePath}`;

  let sha = null;
  try {
    const getRes = await fetch(apiUrl, { headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
  } catch (e) {}

  const body = {
    message: `Update ${filePath} - EduNBN Cô Lê Thị Thanh Hương`,
    content,
    branch: BRANCH
  };

  if (sha) body.sha = sha;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        console.log(`✅ [OK] Pushed: ${filePath}`);
        return true;
      } else {
        let errMsg = res.statusText;
        try {
          const errJson = await res.json();
          errMsg = errJson.message || errMsg;
        } catch (e) {}

        if (attempt < retries) {
          await delay(1000 * attempt);
        } else {
          console.error(`❌ [ERROR] Failed ${filePath}: ${errMsg}`);
        }
      }
    } catch (err) {
      if (attempt < retries) {
        await delay(1000 * attempt);
      } else {
        console.error(`❌ [FETCH ERROR] ${filePath}:`, err.message);
      }
    }
  }
  return false;
}

async function main() {
  console.log(`🚀 Đang chuẩn bị đẩy mã nguồn lên https://github.com/${REPO_OWNER}/${REPO_NAME}...`);
  const files = getFiles('.');
  console.log(`Tìm thấy ${files.length} tệp tin để đẩy lên GitHub.`);

  for (const file of files) {
    await uploadFile(file);
    await delay(350);
  }

  console.log('🎉 Đã hoàn tất đẩy mã nguồn lên GitHub!');
}

main().catch(err => console.error('Fatal error:', err));
