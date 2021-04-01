const path = require('path');
const fs = require('fs');

const keepCount = 2; // 保留最近3条

const pathname = path.join(__dirname, 'prod');
const ignoreDirectory = ['static'];

function subList(list, filePath) {
  if (!list) {
    return [];
  }

  if (list.length > keepCount) {
    const newList = list.sort((a, b) => {
      const aTime = a.split('||')[0];
      const bTime = b.split('||')[0];
      return aTime - bTime;
    });

    newList.length -= keepCount;

    return newList.map((item) => {
      const fileName = item.split('||')[1];
      return path.join(filePath, fileName);
    });
  }

  return [];
}

function getSubName(fileName) {
  const names = fileName.split('.');
  // 文件名前缀
  const prefix = names[0];
  // 文件名后缀
  const subfix = names[names.length - 1];
  // 去除文件名中间的hash
  return `${prefix}.${subfix}`;
}

function clearFile(currentPath) {
  let fileList = fs.readdirSync(currentPath);
  fileList = fileList.sort((a, b) => {
    const aName = getSubName(a);
    const bName = getSubName(b);

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });

  let currentFileName = '';
  let currentFileList = [];
  let clearFilePaths = [];
  for (let i = 0; i < fileList.length; i += 1) {
    const currentFile = fileList[i];
    const fileStat = fs.statSync(path.join(currentPath, currentFile));
    if (fileStat.isDirectory() && !ignoreDirectory.includes(currentFile)) {
      const clearFiles = clearFile(path.join(currentPath, currentFile), clearFilePaths);
      // eslint-disable-next-line no-param-reassign
      clearFilePaths = clearFilePaths.concat(clearFiles);
    }
    else if (fileStat.isFile()) {
      const subName = getSubName(currentFile);
      // 文件修改时间
      const mtime = new Date(fileStat.mtime).getTime();
      if (currentFileName && currentFileName !== subName) {
        // 处理currentFileList
        const subLists = subList(currentFileList, currentPath);
        // console.log(currentFileName, currentFileList.length, subLists.length);
        // eslint-disable-next-line no-param-reassign
        clearFilePaths = clearFilePaths.concat(subLists);

        currentFileList = [];
        currentFileList.push(`${mtime}||${currentFile}`);
        currentFileName = subName;
      }
      else {
        currentFileList.push(`${mtime}||${currentFile}`);
        currentFileName = subName;
      }
    }
  }
  return clearFilePaths;
}

function removeFiles(files) {
  if (!files || 0 === files.length) {
    console.log('数据为空');
    return;
  }

  let count = 0;
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    try {
      const stat = fs.statSync(file);
      if (stat.isFile()) {
        fs.unlinkSync(file);
        count += 1;
      }
      else {
        console.log(file, '不是文件');
      }
    }
    catch (err) {
      console.log(file, err);
    }
  }
  console.log('成功删除', count, '个文件');
}

const readyRemoveFiles = clearFile(pathname);
console.log('readyRemoveFiles', readyRemoveFiles.length);
removeFiles(readyRemoveFiles);
