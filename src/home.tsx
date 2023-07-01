import { useRef, useState } from "react";
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
  const imgSource = useRef<any[]>([]);
  const [imgList, imgListHandle] = useState<any[]>([]);

  const [render, reRender] = useState(1);

  const [bW, bWHandle] = useState(10);
  const [bC, bCHandle] = useState<string | Color>("#fff");
  const [renderImgCount, renderImgCountHandle] = useState(6);
  const [layout, layoutHandle] = useState<"flex-row" | "flex-col">("flex-row");
  const [renderText, renderTextHandle] = useState(false);
  const [text, textHandle] = useState("");

  const getRenderIdx = () => {
    const selectIdx: number[] = [];
    if (imgSource.current.length === 0) return selectIdx;

    const fun = () => {
      if (
        selectIdx.length === imgSource.current.length ||
        selectIdx.length === renderImgCount
      )
        return;

      const index = getRandom(0, imgSource.current.length - 1);
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
  const renderArr = getRenderIdx();
  const textRenderIdx = getRandom(0, renderArr.length - 1);

  console.log("renderArr ===> ", renderArr);
  console.log("textRenderIdx ===> ", textRenderIdx);

  return (
    <div>
      <div className="fixed left-0 top-0 flex h-14 w-screen items-center bg-white pl-4 shadow-2xl">
        <Upload
          multiple
          className="mr-12"
          fileList={imgList}
          showUploadList={false}
          onChange={({ fileList }) => {
            imgListHandle([...fileList]);
          }}
          customRequest={data => {
            imgSource.current.push(data);
            imgListHandle([...imgList]);
          }}
        >
          <Button icon={<UploadOutlined />}>
            上传素材 当前存在{imgSource.current.length}
          </Button>
        </Upload>

        <Button
          onClick={() => {
            reRender(render + 1);
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

        <div className="inline-flex items-center">
          <Switch
            checked={renderText}
            className="mr-3 w-[100px]"
            checkedChildren="有文字"
            unCheckedChildren="无文字"
            onChange={renderTextHandle}
          />
          {renderText ? (
            <Input
              value={text}
              onChange={evn => {
                textHandle(evn.target.value);
              }}
            ></Input>
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
                const { file } = imgSource.current[e];
                const src = URL.createObjectURL(file);
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
                      <div className="absolute bottom-6 right-6 rounded-md bg-black/25 p-2 text-[20px] font-bold text-white">
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
