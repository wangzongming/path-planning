import React from "react";
import style from "./style.less"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import { Modal } from "antd-mobile"

//将地址转为坐标  
const addressToLongAntLat = (address, city) => {
    const { BMap } = window;
    return new Promise((resolve, reject) => {
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        //解析终点地址
        myGeo.getPoint(address, function (point) {
            if (point) {
                resolve(point);
            } else {
                reject("您选择地址没有解析到结果!");
                Modal.alert("您选择地址没有解析到结果!");
            }
        }, city);
    })
}

const Drive = (props) => {
    //@type  WalkingRoute 步行    DrivingRoute 驾车    TransitRoute 公交
    const { targetAddress, address, type, city } = props;
    const { BMap, BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE } = window;
    const [panningOpen, setPanningOpen] = React.useState(false);
    const policys = [{ name: "最少时间", key: "BMAP_DRIVING_POLICY_LEAST_TIME", value: BMAP_DRIVING_POLICY_LEAST_TIME }, { name: "最短距离", key: "BMAP_DRIVING_POLICY_LEAST_DISTANCE", value: BMAP_DRIVING_POLICY_LEAST_DISTANCE }];//采访方式
    const [policy, setPolicy] = React.useState(policys[0].key);//默认采用最短时间
    const mapRef = React.useRef();
    const routepannRef = React.useRef();
    const stimer = React.useRef();
    const id = `map_${type}`;

    //@start 开始地址
    //@end   结束地址
    //@route 路线方式  	驾车策略：最少时间，最短距离  [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE];
    const searchRoute = (start, end, policy) => {
        let driving = new BMap[type](mapRef.current, {
            renderOptions: {
                map: mapRef.current,
                autoViewport: true,
                panel: routepannRef.current,
            },
            policy: policy,
        });
        driving.search(start, end);
    }

    const createMap = async () => {
        // 百度地图API功能
        mapRef.current = new BMap.Map(id);

        //解析起点地址 终点地址
        // 将地址解析结果显示在地图上,并调整地图视野
        let startPoint = await addressToLongAntLat(address, city);

        //地图定位到起点位置
        mapRef.current.centerAndZoom(startPoint, 18);
    }

    React.useEffect(() => {
        createMap();
    }, []);

    React.useEffect(() => {
        const asFn = async () => {
            //清除
            mapRef.current.clearOverlays();
            //解析起点地址 终点地址
            // 将地址解析结果显示在地图上,并调整地图视野
            let startPoint = await addressToLongAntLat(address, city);
            let endPoint = await addressToLongAntLat(targetAddress, city);

            //执行搜索方法
            searchRoute(startPoint, endPoint, policys.filter(item => item.key === policy)[0].value);
        }

        //执行路线搜索速度会非常快 暂时只用简单节流控制
        clearTimeout(stimer.current);
        stimer.current = setTimeout(asFn, 600);
    }, [policy, targetAddress, address]);

    //打开路线详情
    const openDetail = () => {
        setPanningOpen(!panningOpen)
    }
    return <div className={style.Drive}>
        <div className={style.top}>
            {policys.map(({ name, key }) => <div key={key} onClick={() => setPolicy(key)} className={`${style.item} ${policy === key ? style.selected : null} ${style[key]}`}>{name}</div>)}
        </div>
        <div className={style.map} id={id}></div>
        <div className={style.footer}>
            <div className={style.bottom} onClick={openDetail}>
                <div className={style.title}>
                    {panningOpen ? [<DownOutlined />, ' 关闭'] : [<UpOutlined />, ' 展开']}路线详情
                </div>
                <div ref={routepannRef} className={`${style.DriveRouteDetail} ${panningOpen ? style.opened : null}`}></div>
            </div>
        </div>
    </div>
}

export default Drive;