import { QRCodeSVG } from "qrcode.react";

import MoonStar from "../assets/images/MoonStar.png";

const QRGenerator = ({ value, size, imageSize, noImage }) => {
  return (
    <QRCodeSVG
      value={value}
      size={size || 130}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      includeMargin={false}
      // imageSettings={
      //   !noImage && {
      //     src: MoonStar,
      //     x: undefined,
      //     y: undefined,
      //     height: imageSize || 24,
      //     width: imageSize || 24,
      //     excavate: true,
      //   }
      // }
    />
  );
};

export default QRGenerator;
