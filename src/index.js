
import React, { Component } from "react";
import style from "./style.less"
import { Tabs, InputItem } from "antd-mobile"
import gongjiaoimg from './imgs/gongjiao.svg';
import gongjiao_edimg from './imgs/gongjiao_ed.svg';
import walkingimg from './imgs/walking.svg';
import walking_edimg from './imgs/walking_ed.svg';
import marker from './imgs/Marker.svg';
import yuan from './imgs/yuan.svg';
import { CarOutlined, SwapOutlined } from "@ant-design/icons"
import Drive from "./Drive"
const gongjiao = <img style={{ width: 16 }} src={gongjiaoimg} alt="gongjiaoimg" />;
const gongjiaoEd = <img style={{ width: 16 }} src={gongjiao_edimg} alt="gongjiaoimg" />;
const walking = <img style={{ width: 16 }} src={walkingimg} alt="walking" />;
const walkingEd = <img style={{ width: 16 }} src={walking_edimg} alt="walking" />;
const markerimg = <img style={{ width: 16 }} src={marker} alt="marker" />;
const yuanimg = <img style={{ width: 16 }} src={yuan} alt="yuan" />;

//公交车和步行直接基于驾驶就行
const Public = (props) => <Drive {...props} />;
const Walking = (props) => <Drive {...props} />;

class RoutePanning extends Component {
    state = {
        //城市
        city: this.props.city || "大连市",
        //包含了当前地址和 目标地址
        address: this.props.startAddress,
        targetAddress: this.props.endAddress,

        curTabKey: "drive"
    }

    //切换目标和出发点
    chnageTarget = () => {
        this.setState({
            address: this.state.targetAddress,
            targetAddress: this.state.address,
        })
    }

    addressChange = (val, type) => {
        this.setState({
            [type]: val
        })
    }

    render() {
        const { address, targetAddress, city, curTabKey } = this.state;
        const tabs = [
            {
                title: <div key="drive"><CarOutlined key="CarOutlinedimg" /> 驾车</div>,
                key: "drive",
                type: "DrivingRoute",
                Com: Drive
            },

            {
                title: <div key="public">{curTabKey === 'public' ? gongjiaoEd : gongjiao} 公交</div>,
                key: "public",
                type: "TransitRoute",
                Com: Public
            },
            {
                title: <div key="walk">{curTabKey === 'walk' ? walkingEd : walking}{} 步行</div>,
                key: "walk",
                type: "WalkingRoute",
                Com: Walking
            },
        ];
        return <div className={style.page}>
            <div className={style.pageContainer}>

                <div className={style.con}>
                    <div className={style.address}>
                        <div className={style.left}>
                            <div className={style.start}>
                                <InputItem onChange={(val) => this.addressChange(val, "address")} labelNumber={1} value={address} placeholder="起点">
                                    {yuanimg}
                                </InputItem>
                            </div>
                            <div className={style.target}>
                                <InputItem onChange={(val) => this.addressChange(val, "targetAddress")} labelNumber={1} value={targetAddress} placeholder="终点">
                                    {markerimg}
                                </InputItem>
                            </div>
                        </div>
                        <div className={style.right} onClick={this.chnageTarget}>
                            <SwapOutlined rotate={-90} />
                        </div>
                    </div>
                    {/* 出行方式tab */}
                    <div className={style.tabs}>
                        <Tabs tabs={tabs} page={curTabKey} onChange={({ key }) => this.setState({ curTabKey: key })}>
                            {
                                tabs.map(({ key, Com, type }) => {
                                    return <div key={key} className={style.tabContent} id={key}>
                                        <Com {...this.props} type={type} address={address} targetAddress={targetAddress} city={city} />
                                    </div>
                                })
                            }
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default RoutePanning;