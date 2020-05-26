// index.ts
import rings from "../../images/rings";
import { inArray } from "../../utils/util";

const devices: WechatMiniprogram.CallbackResultBlueToothDevice[] = [
  // {
  //   advertisData: new ArrayBuffer(0),
  //   advertisServiceUUIDs: [],
  //   serviceData: {},
  //   deviceId: "AA86730D-C651-4A3E-AB40-C1C7A3EBCE9F",
  //   name: "TEST 01",
  //   localName: "We Test",
  //   RSSI: -40
  // }
];

Page({
  hide: false,

  data: {
    rings: rings,
    available: false,
    discovering: false,
    devices: devices,
  },

  onLoad() {
    console.log("index.onLoad");

    wx.onBluetoothAdapterStateChange(res => this.onAdapterStateChange(res));
    wx.onBluetoothDeviceFound(res => this.onDeviceFound(res));
    // 初始化蓝牙模块
    this.openAdapter();
  },

  onReady() {
    console.log("index.onReady");

  },

  onShow() {
    console.log("index.onShow");

    this.hide = false;
    if (this.data.available && !this.data.discovering) {
      this.startDiscovery();
    }
  },

  onHide() {
    console.log("index.onHide");

    this.hide = true;
    if (this.data.available && this.data.discovering) {
      this.stopDiscovery();
    }
  },

  onUnload() {
    console.log("index.onUnload");

    // 关闭蓝牙模块
    this.closeAdapter();
  },

  onPullDownRefresh() {
    console.log("index.onPullDownRefresh");

    const data: Record<string, any> = {};
    data["devices"] = [];
    this.setData(data);
    this.stopPullDownRefresh();
  },

  onAdapterStateChange(res: WechatMiniprogram.OnBluetoothAdapterStateChangeCallbackResult) {
    console.log(`device.onAdapterStateChange: ${res.available} - ${res.discovering}`);

    const data: Record<string, any> = {};
    data["available"] = res.available;
    data["discovering"] = res.discovering;
    this.setData(data);

    if (res.available) {
      if (this.hide && res.discovering) {
        // 页面处于隐藏状态时停止搜索
        this.stopDiscovery();
      } else if (!this.hide && !res.discovering) {
        // 页面处于显示状态时开始搜索
        this.startDiscovery();
      }
    }
  },

  onDeviceFound(res: WechatMiniprogram.OnBluetoothDeviceFoundCallbackResult) {
    console.log(`index.onDeviceFound: ${res.devices}`);

    res.devices.forEach(device => {
      const data: { [key: string]: any } = {};
      const i = inArray(this.data.devices, 'deviceId', device.deviceId);
      if (i === -1) {
        console.log(`device.onDeviceFound 新设备: ${JSON.stringify(device)}`);

        const length = this.data.devices.length;
        data[`devices[${length}]`] = device;
      } else {
        data[`devices[${i}]`] = device;
      }
      this.setData(data);
    });
  },

  openAdapter() {
    const option1: WechatMiniprogram.OpenBluetoothAdapterOption = {
      success: res => {
        console.log(`index.openAdapter 成功: ${res.errCode} - ${res.errMsg}`);

        const option2: WechatMiniprogram.GetBluetoothAdapterStateOption = {
          success: res => {
            console.log(`index.openAdapter 获取状态成功: ${res.available} - ${res.discovering}`);

            this.onAdapterStateChange(res);
          },
          fail: res => console.log(`index.openAdapter 获取状态失败: ${res.errCode} - ${res.errMsg}`)
        };
        wx.getBluetoothAdapterState(option2);
      },
      fail: res => console.log(`index.openAdapter 失败: ${res.errCode} - ${res.errMsg}`)
    };
    wx.openBluetoothAdapter(option1);
  },

  closeAdapter() {
    const option: WechatMiniprogram.CloseBluetoothAdapterOption = {
      success: res => console.log(`index.closeAdapter 成功: ${res.errCode} - ${res.errMsg}`),
      fail: res => console.log(`index.closeAdapter 失败: ${res.errCode} - ${res.errMsg}`)
    };
    wx.closeBluetoothAdapter(option);
  },

  startDiscovery() {
    const option: WechatMiniprogram.StartBluetoothDevicesDiscoveryOption = {
      allowDuplicatesKey: true,
      success: res => console.log(`index.startDiscovery 成功: ${res.errCode} - ${res.errMsg}`),
      fail: res => console.log(`index.startDiscovery 失败: ${res.errCode} - ${res.errMsg}`)
    }
    wx.startBluetoothDevicesDiscovery(option);
  },

  stopDiscovery() {
    const option: WechatMiniprogram.StopBluetoothDevicesDiscoveryOption = {
      success: res => console.log(`index.stopDiscovery 成功: ${res.errCode} - ${res.errMsg}`),
      fail: res => console.log(`index.stopDiscovery 失败: ${res.errCode} - ${res.errMsg}`)
    };
    wx.stopBluetoothDevicesDiscovery(option);
  },

  stopPullDownRefresh() {
    const option: WechatMiniprogram.StopPullDownRefreshOption = {
      success: res => console.log(`index.stopPullDownRefresh 成功: ${res.errMsg}`),
      fail: res => console.log(`index.stopPullDownRefresh 失败: ${res.errMsg}`)
    };
    wx.stopPullDownRefresh(option);
  }
})
