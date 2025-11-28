export type Language = 'ko' | 'en';

export const translations = {
  ko: {
    // Navigation
    nav: {
      myTablets: '내 태블릿',
      logout: '로그아웃',
      login: '로그인',
    },
    // Hero Section
    hero: {
      title: '태블릿 기기제어 서비스',
      subtitle: 'ROBO Cloud로 모든 태블릿을 원격에서 제어하고 관리하세요',
      googleLogin: '구글 로그인',
    },
    // Features
    features: {
      monitoring: {
        title: '실시간 모니터링',
        description: '모든 태블릿의 상태를 실시간으로 확인하고 모니터링하세요',
        activeDevices: '활성 기기',
        totalDevices: '/30 총 기기',
        avgBattery: '평균 배터리',
        avgWifi: '평균 Wi-Fi',
        systemStatus: '시스템 상태',
        normal: '정상',
        allSystemsRunning: '모든 시스템 운영 중',
        hourlyActiveDevices: '시간별 활성 기기',
        deviceBatteryStatus: '기기별 배터리 상태',
      },
      control: {
        title: '기기 제어',
        description: '태블릿의 전원, 설정 등을 원격에서 제어할 수 있습니다',
        totalControls: '총 제어 횟수',
        today: '오늘',
        activeDevices: '활성 기기',
        devices: '/5 기기',
        avgResponseTime: '평균 응답 시간',
        fastResponse: '빠른 응답',
        deviceControlPanel: '기기 제어 패널',
        controlHistory: '제어 히스토리',
        turnOff: '끄기',
        turnOn: '켜기',
      },
      info: {
        title: '기기 정보',
        description: 'MAC 주소, 배터리, 와이파이 강도 등 상세한 기기 정보를 확인하세요',
        totalDevices: '총 기기 수',
        registeredDevices: '등록된 기기',
        avgBattery: '평균 배터리',
        allDevices: '전체 기기',
        avgWifi: '평균 Wi-Fi',
        connectionStrength: '연결 강도',
        latestVersion: '최신 버전',
        devices: '4/5 기기',
        deviceDetails: '기기 상세 정보',
        versionDistribution: '버전 분포',
        battery: '배터리',
        wifi: 'Wi-Fi',
      },
    },
    // Thank You Section
    thankYou: {
      title: '읽어주셔서 감사합니다',
      subtitle: 'ROBO Cloud와 함께 태블릿 관리를 시작해보세요',
      googleLogin: '구글 로그인',
    },
    // Footer
    footer: {
      copyright: '© 2024 ROBO Cloud. All rights reserved.',
    },
    // Tablets Page
    tablets: {
      title: '내 태블릿',
      description: '등록된 태블릿의 상태를 실시간으로 확인하세요',
      totalTablets: '총 태블릿 수',
      registeredDevices: '등록된 기기',
      activeDevices: '활성 기기',
      devices: '기기',
      avgBattery: '평균 배터리',
      allDevices: '전체 기기',
      avgWifi: '평균 Wi-Fi',
      connectionStrength: '연결 강도',
      tabletList: '태블릿 목록',
      macAddress: 'MAC Address',
      tableNumber: '테이블 번호',
      wifiStrength: '와이파이 강도',
      batteryLevel: '배터리 총량',
      version: '버전',
      ipAddress: 'IP 주소',
      firmwareBuild: '펌웨어 빌드',
      onOff: 'On/Off',
      noTablets: '등록된 태블릿이 없습니다.',
    },
  },
  en: {
    // Navigation
    nav: {
      myTablets: 'My Tablets',
      logout: 'Logout',
      login: 'Login',
    },
    // Hero Section
    hero: {
      title: 'Tablet Device Control Service',
      subtitle: 'Control and manage all your tablets remotely with ROBO Cloud',
      googleLogin: 'Google Login',
    },
    // Features
    features: {
      monitoring: {
        title: 'Real-time Monitoring',
        description: 'Monitor and check the status of all tablets in real-time',
        activeDevices: 'Active Devices',
        totalDevices: '/30 Total Devices',
        avgBattery: 'Average Battery',
        avgWifi: 'Average Wi-Fi',
        systemStatus: 'System Status',
        normal: 'Normal',
        allSystemsRunning: 'All systems operational',
        hourlyActiveDevices: 'Hourly Active Devices',
        deviceBatteryStatus: 'Device Battery Status',
      },
      control: {
        title: 'Device Control',
        description: 'Remotely control power, settings, and more for your tablets',
        totalControls: 'Total Controls',
        today: 'Today',
        activeDevices: 'Active Devices',
        devices: '/5 Devices',
        avgResponseTime: 'Average Response Time',
        fastResponse: 'Fast Response',
        deviceControlPanel: 'Device Control Panel',
        controlHistory: 'Control History',
        turnOff: 'Turn Off',
        turnOn: 'Turn On',
      },
      info: {
        title: 'Device Information',
        description: 'Check detailed device information including MAC address, battery, Wi-Fi strength, and more',
        totalDevices: 'Total Devices',
        registeredDevices: 'Registered Devices',
        avgBattery: 'Average Battery',
        allDevices: 'All Devices',
        avgWifi: 'Average Wi-Fi',
        connectionStrength: 'Connection Strength',
        latestVersion: 'Latest Version',
        devices: '4/5 Devices',
        deviceDetails: 'Device Details',
        versionDistribution: 'Version Distribution',
        battery: 'Battery',
        wifi: 'Wi-Fi',
      },
    },
    // Thank You Section
    thankYou: {
      title: 'Thank You for Reading',
      subtitle: 'Start managing your tablets with ROBO Cloud',
      googleLogin: 'Google Login',
    },
    // Footer
    footer: {
      copyright: '© 2024 ROBO Cloud. All rights reserved.',
    },
    // Tablets Page
    tablets: {
      title: 'My Tablets',
      description: 'Check the status of your registered tablets in real-time',
      totalTablets: 'Total Tablets',
      registeredDevices: 'Registered Devices',
      activeDevices: 'Active Devices',
      devices: 'Devices',
      avgBattery: 'Average Battery',
      allDevices: 'All Devices',
      avgWifi: 'Average Wi-Fi',
      connectionStrength: 'Connection Strength',
      tabletList: 'Tablet List',
      macAddress: 'MAC Address',
      tableNumber: 'Table Number',
      wifiStrength: 'Wi-Fi Strength',
      batteryLevel: 'Battery Level',
      version: 'Version',
      ipAddress: 'IP Address',
      firmwareBuild: 'Firmware Build',
      onOff: 'On/Off',
      noTablets: 'No registered tablets.',
    },
  },
};

export const getTranslation = (lang: Language) => translations[lang];

