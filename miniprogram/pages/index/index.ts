// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

function inArray(arr: string | any[], key: string | number, val: any) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

Page({
  mDiscoveryStarted: false,
  data: {
    motto: 'Hello WeChat',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    devices: [
      // {
      //   deviceId: 'CA59B12E-A032-4E30-8F3B-2A0FBAEF30AA',
      //   name: 'MOCK BLE'
      // }
    ]
  },
  // 事件处理函数
  bindViewTap() {
    wx.scanCode({
      scanType: ["qrCode"],
      success: res => {
        const option: WechatMiniprogram.ShowToastOption = {
          "title": res.result,
          "duration": 5000
        }
        wx.showToast(option);
      }
    })
    // wx.navigateTo({
    //   url: '../logs/logs',
    // })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        },
      })
    }
  },
  getUserInfo(e: any) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  startScan() {
    const option: WechatMiniprogram.OpenBluetoothAdapterOption = {
      success: () => this.startDiscovery()
    }
    wx.openBluetoothAdapter(option)
  },
  startDiscovery() {
    if (this.mDiscoveryStarted) {
      return;
    }
    this.mDiscoveryStarted = true
    const callback: WechatMiniprogram.OnBluetoothDeviceFoundCallback = res => {
      res.devices.forEach(device => {
        const data: { [key: string]: any } = {};
        const i = inArray(this.data.devices, 'deviceId', device.deviceId);
        if (i === -1) {
          const length = this.data.devices.length;
          data[`devices[${length}]`] = device;
        } else {
          data[`devices[${i}]`] = device;
        }
        this.setData(data);
      });
    }
    const option: WechatMiniprogram.StartBluetoothDevicesDiscoveryOption = {
      success: () => wx.onBluetoothDeviceFound(callback)
    }
    wx.startBluetoothDevicesDiscovery(option);
  },
  navigate() {
    const option: WechatMiniprogram.NavigateToOption = {
      url: '../device/device'
    };
    wx.navigateTo(option);
  }
})
