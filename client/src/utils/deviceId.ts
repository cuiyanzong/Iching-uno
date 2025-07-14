// 生成并管理设备唯一ID
export function getDeviceId(): string {
  const DEVICE_ID_KEY = 'iching_uno_device_id';
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // 生成一个基于时间戳和随机数的唯一ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

// 重置设备ID（仅在测试时使用）
export function resetDeviceId(): string {
  const DEVICE_ID_KEY = 'iching_uno_device_id';
  localStorage.removeItem(DEVICE_ID_KEY);
  return getDeviceId();
}