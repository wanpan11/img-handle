import { useMemo, useState } from "react";
import { Button, Select, Upload, ColorPicker, Switch, Input } from "antd";
import type { Color } from "antd/es/color-picker";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { imgCountOptions, layoutOptions } from "./config";

function getRandom(min: number, max: number) {
  const floatRandom = Math.random();
  const difference = max - min;

  // 介于 0 和差值之间的随机数
  const random = Math.round(difference * floatRandom);
  const randomWithinRange = random + min;

  return randomWithinRange;
}

function getImgPreview(ele: HTMLElement, container: HTMLElement) {
  const options: any = {
    scale: 2,
    scrollX: container.scrollWidth,
    width: ele.scrollWidth,
  };

  html2canvas(ele, options).then(function (canvas) {
    canvas.toBlob(function (blob) {
      if (blob) {
        saveAs(blob, `${Date.now()}`);
      }
    });
  });
}

const Home = () => {
  const [imgList, imgListHandle] = useState<any[]>([]);

  const [bW, bWHandle] = useState(10);
  const [bC, bCHandle] = useState<string | Color>("#fff");
  const [renderImgCount, renderImgCountHandle] = useState(6);
  const [layout, layoutHandle] = useState<"flex-row" | "flex-col">("flex-row");
  const [renderText, renderTextHandle] = useState(false);
  const [text, textHandle] = useState("");
  const [textC, textCHandle] = useState<string | Color>("#fff");

  const renderArr = useMemo(() => {
    const getRenderIdx = () => {
      const selectIdx: number[] = [];
      if (imgList.length === 0) return selectIdx;

      const fun = () => {
        if (
          selectIdx.length === imgList.length ||
          selectIdx.length === renderImgCount
        )
          return;

        const index = getRandom(0, imgList.length - 1);
        if (selectIdx.includes(index)) {
          fun();
        } else {
          selectIdx.push(index);
          fun();
        }
      };
      fun();

      return selectIdx;
    };
    return getRenderIdx();
  }, [renderImgCount, imgList]);

  const textRenderIdx = useMemo(() => {
    return getRandom(0, renderArr.length - 1);
  }, [renderArr]);

  console.log("renderArr ===> ", renderArr);
  console.log("textRenderIdx ===> ", textRenderIdx);

  return (
    <div>
      <div className="fixed left-0 top-0 z-10 flex h-14 w-screen items-center bg-white pl-4 shadow-2xl">
        <Upload
          multiple
          className="mr-12"
          fileList={imgList}
          showUploadList={false}
          onChange={({ fileList }) => {
            imgListHandle([...fileList]);
          }}
          customRequest={() => {
            return;
          }}
        >
          <Button icon={<UploadOutlined />}>
            上传素材 当前存在{imgList.length}
          </Button>
        </Upload>

        <Button
          onClick={() => {
            imgListHandle([...imgList]);
          }}
        >
          重排
        </Button>

        <Button
          className="ml-4 mr-4"
          onClick={() => {
            getImgPreview(
              document.getElementById("canvasEle") as HTMLElement,
              document.getElementById("canvasBox") as HTMLElement
            );
          }}
        >
          下载图片
        </Button>

        <div className="ml-4 mr-4 flex items-center">
          <span>边框宽度：</span>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              bWHandle(bW + 1);
            }}
          />
          <span className="ml-1 mr-1">{bW}</span>
          <Button
            icon={<MinusCircleOutlined />}
            onClick={() => {
              bWHandle(bW - 1);
            }}
          />
          <span className="ml-4">边框颜色：</span>
          <ColorPicker value={bC} onChange={bCHandle} />
        </div>

        <div className="ml-4 mr-4">
          图片数量：
          <Select
            value={renderImgCount}
            options={imgCountOptions}
            onChange={val => {
              renderImgCountHandle(val);
            }}
          />
        </div>

        <div className="ml-4 mr-4">
          排列方式：
          <Select
            value={layout}
            options={layoutOptions}
            onChange={val => {
              layoutHandle(val);
            }}
          />
        </div>

        <div className="flex  items-center">
          <Switch
            checked={renderText}
            className="mr-3 min-w-[80px]"
            checkedChildren="有文字"
            unCheckedChildren="无文字"
            onChange={renderTextHandle}
          />
          {renderText ? (
            <>
              <ColorPicker
                value={textC}
                className="mr-2 min-w-[32px]"
                onChange={textCHandle}
              />

              <Input
                value={text}
                placeholder="请输入文案"
                onChange={evn => {
                  textHandle(evn.target.value);
                }}
              />
            </>
          ) : null}
        </div>
      </div>

      <div
        className={`mt-20 box-border inline-flex w-full overflow-auto bg-black pb-10 pt-10 shadow-2xl ${
          layout === "flex-col" ? "justify-center" : "items-center p-10"
        }`}
        id="canvasBox"
      >
        <div
          id="canvasEle"
          className={`inline-flex ${layout} ${
            layout === "flex-col" ? "w-[800px]" : "h-[400px]"
          }`}
        >
          {imgList.length
            ? renderArr.map((e, i) => {
                const { originFileObj } = imgList[e];
                const src = URL.createObjectURL(originFileObj);
                const last = renderArr.length - 1 === i;

                return (
                  <div key={e} className="relative">
                    <img
                      src={src}
                      style={{
                        padding: `${bW}px`,
                        [layout === "flex-row" ? "height" : "width"]: `100%`,
                        backgroundColor:
                          typeof bC === "string" ? bC : bC.toHexString(),
                      }}
                      className={classNames("box-border", {
                        "pr-0": layout === "flex-row" && !last,
                        "pb-0": layout === "flex-col" && !last,
                      })}
                    />

                    {i === textRenderIdx && text ? (
                      <div
                        className="absolute bottom-6 right-6 text-[20px] font-bold"
                        style={{
                          color:
                            typeof textC === "string"
                              ? textC
                              : textC.toHexString(),
                        }}
                      >
                        {text}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
