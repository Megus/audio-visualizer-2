function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return ab;
}

function scaleImageInFrame(fit, imgW, imgH, frameW, frameH) {
	let x, y, w, h, sx, sy, sw, sh;

	if (fit === "aspectFit") {
		// Fit the whole image and keep the aspect ratio
		sx = 0;
		sy = 0;
		sw = imgW;
		sh = imgH;

		h = frameH;
		w = imgW * (h / imgH);
		if (w > frameW) {
			w = frameW;
			h = imgH * (w / imgW);
		}
		x = (frameW - w) / 2;
		y = (frameH - h) / 2;
	} else if (fit === "aspectFill") {
		// Fill the frame but keep the aspect ratio
		x = 0;
		y = 0;
		w = frameW;
		h = frameH;
		let ratio = w / imgW;
		if (imgH * ratio > h) {
			sw = imgW;
			sh = h / ratio;
			sx = 0;
			sy = (imgH - sh) / 2;
		} else {
			let ratio = h / imgH;
			sw = w / ratio;
			sh = imgH;
			sx = (imgW - sw) / 2;
			sy = 0;
		}
	} else {
		// Fill the frame, ignore the aspect ratio
		sx = 0;
		sy = 0;
		sw = imgW;
		sh = imgH;

		x = 0;
		y = 0;
		w = frameW;
		h = frameH;
	}
	// TODO: Add more modes: fillWidth, fillHeight...

	x = Math.floor(x);
	y = Math.floor(y);
	w = Math.floor(w);
	h = Math.floor(h);
	sx = Math.floor(sx);
	sy = Math.floor(sy);
	sw = Math.floor(sw);
	sh = Math.floor(sh);

	return {x, y, w, h, sx, sy, sw, sh};
}

export {
  toArrayBuffer,
  scaleImageInFrame,
};
