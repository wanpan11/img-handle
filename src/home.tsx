import { Button, Select, Upload } from "antd";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import classNames from "classnames";

function getRandom(min: number, max: number) {
  const floatRandom = Math.random();
  const difference = max - min;

  // 介于 0 和差值之间的随机数
  const random = Math.round(difference * floatRandom);
  const randomWithinRange = random + min;

  return randomWithinRange;
}

function getImgPreview(ele: HTMLElement, container: HTMLElement) {
  // debugger;
  html2canvas(ele, {
    scale: 2,
    scrollX: container.scrollWidth,
    width: ele.scrollWidth,
  }).then(function (canvas) {
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
  const [init, initHandle] = useState(false);

  const [render, reRender] = useState(1);
  const [bW, bWHandle] = useState(10);
  const [renderCount, renderCountHandle] = useState(6);
  const [layout, layoutHandle] = useState<"flex-row" | "flex-col">("flex-row");

  // useEffect(() => {
  //   const getImg = async () => {
  //     if (img_list.length) {
  //       let img = img_list.shift() as string;

  //       while (img) {
  //         const imgModule: { default: string } = await import(
  //           "@img/" + img.split("/")[1]
  //         );
  //         imgSource.current.push(imgModule.default);

  //         if (img_list.length) {
  //           img = img_list.shift() as string;
  //         } else {
  //           img = "";
  //         }
  //       }

  //       initHandle(true);
  //     }
  //   };

  //   getImg();
  // }, []);

  const getRenderIdx = () => {
    const selectIdx: number[] = [];
    if (imgSource.current.length === 0) return selectIdx;

    const fun = () => {
      if (
        selectIdx.length === imgSource.current.length ||
        selectIdx.length === renderCount
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

  console.log("renderArr ===> ", renderArr);

  return (
    <div>
      <div className="fixed left-0 top-0 flex h-14 w-screen items-center justify-center bg-white shadow-2xl">
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
            initHandle(true);
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

        <div className="ml-4 mr-4">
          <span>边框宽度 {bW} </span>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              bWHandle(bW + 1);
            }}
          />
          <Button
            icon={<MinusCircleOutlined />}
            onClick={() => {
              bWHandle(bW - 1);
            }}
          />
        </div>

        <div className="ml-4 mr-4">
          图片数量：
          <Select
            value={renderCount}
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
            ]}
            onChange={val => {
              renderCountHandle(val);
            }}
          />
        </div>

        <div className="ml-4 mr-4">
          排列方式：
          <Select
            value={layout}
            options={[
              { value: "flex-row", label: "横向" },
              { value: "flex-col", label: "轴向" },
            ]}
            onChange={val => {
              layoutHandle(val);
            }}
          />
        </div>
      </div>

      <div
        className="mt-20 box-border overflow-auto bg-black p-11 shadow-2xl"
        id="canvasBox"
      >
        <div
          id="canvasEle"
          className={`flex ${layout} ${
            layout === "flex-col" ? "w-[800px]" : "h-[400px]"
          }`}
        >
          {init
            ? renderArr.map((e, i) => {
                const { file } = imgSource.current[e];
                const src = URL.createObjectURL(file);
                const last = renderArr.length - 1 === i;

                return (
                  <img
                    src={src}
                    key={e}
                    style={{
                      padding: `${bW}px`,
                      [layout === "flex-row" ? "height" : "width"]: `100%`,
                    }}
                    className={classNames("box-border bg-white", {
                      "pr-0": layout === "flex-row" && !last,
                      "pb-0": layout === "flex-col" && !last,
                    })}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
