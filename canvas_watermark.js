export const renderCanvas = async (imageUrl, { text = '', width = 300, height = 225, lineHeight, stampUrl }) => {
  if (!imageUrl) {
    return '';
  }

  const img = document.createElement('img');
  // const text = '测试名字测试名字测试名字测试名字测试名字测试名字';
  img.src = imageUrl;
  const maxWidth = 260;
  // img.setAttribute("crossOrigin", "anonymous"); // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  // 创建canvas DOM元素，并设置其宽高和图片一样
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  if (text) {
    // 添加文字
    ctx.fillStyle = 'red';
    ctx.font = "18px '微软雅黑'";
    ctx.textBaseline = 'middle';
    let line = '';
    const arrText = text.split('');
    let y = 24;
    for (let n = 0; n < arrText.length; n += 1) {
      const testLine = line + arrText[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && 0 < n) {
        ctx.fillText(line, 20, y);
        line = arrText[n];
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, 20, y);
  }

  if (stampUrl) {
    const stampImg = document.createElement('img');
    stampImg.src = stampUrl;

    await new Promise((resolve) => {
      stampImg.onload = resolve;
    });

    ctx.drawImage(stampImg, 150, 100);
  }

  const url = canvas.toDataURL('image/png');
  return url;
};

export default '';
