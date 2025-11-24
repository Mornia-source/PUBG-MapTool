// 地图配置 - 支持多分辨率动态加载
const mapConfig = {
    erangel: {
        name: '艾伦格',
        nameEn: 'Erangel',
        images: {
            zh: {
                low: 'img/maps/erangel/zh/艾伦格_@low.webp',
                medium: 'img/maps/erangel/zh/艾伦格_@medium.webp',
                high: 'img/maps/erangel/zh/艾伦格.webp'
            },
            en: {
                low: 'img/maps/erangel/en/艾伦格-Erangel_Main_High_Res_@low.webp',
                medium: 'img/maps/erangel/en/艾伦格-Erangel_Main_High_Res_@medium.webp',
                high: 'img/maps/erangel/en/艾伦格-Erangel_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/erangel/3602174806_preview_photo_2025-10-20_03-26-09.jpg'
        },
        markerTypes: ['密室', '载具', '滑翔机', '游艇']
    },
    taego: {
        name: '泰戈',
        nameEn: 'Taego',
        images: {
            zh: {
                low: 'img/maps/taego/zh/泰戈_@low.webp',
                medium: 'img/maps/taego/zh/泰戈_@medium.webp',
                high: 'img/maps/taego/zh/泰戈.webp'
            },
            en: {
                low: 'img/maps/taego/en/泰戈-Taego_Main_High_Res_@low.webp',
                medium: 'img/maps/taego/en/泰戈-Taego_Main_High_Res_@medium.webp',
                high: 'img/maps/taego/en/泰戈-Taego_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/taego/3602174806_preview_photo_2025-10-20_03-26-11.jpg'
        },
        markerTypes: ['密室', '载具', '滑翔机']
    },
    rondo: {
        name: '荣都',
        nameEn: 'Rondo',
        images: {
            zh: {
                low: 'img/maps/rondo/zh/荣都_@low.webp',
                medium: 'img/maps/rondo/zh/荣都_@medium.webp',
                high: 'img/maps/rondo/zh/荣都.webp'
            },
            en: {
                low: 'img/maps/rondo/en/荣都-Rondo_Main_High_Res_@low.webp',
                medium: 'img/maps/rondo/en/荣都-Rondo_Main_High_Res_@medium.webp',
                high: 'img/maps/rondo/en/荣都-Rondo_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/rondo/3602174806_preview_photo_2025-11-05_13-48-53.jpg'
        },
        // 荣都：增加加油站、加电站、交易点
        // 排布顺序（每行 3 列）：
        // 第 1 行：密室 | 载具 | 滑翔机
        // 第 2 行：交易点 | 加油站 | 加电站
        // 第 3 行：金条
        markerTypes: ['密室', '载具', '滑翔机', '交易点', '加油站', '加电站', '金条']
    },
    vikendi: {
        name: '维寒迪',
        nameEn: 'Vikendi',
        images: {
            zh: {
                low: 'img/maps/vikendi/zh/维寒迪_@low.webp',
                medium: 'img/maps/vikendi/zh/维寒迪_@medium.webp',
                high: 'img/maps/vikendi/zh/维寒迪.webp'
            },
            en: {
                low: 'img/maps/vikendi/en/维寒迪-Vikendi_Main_High_Res_@low.webp',
                medium: 'img/maps/vikendi/en/维寒迪-Vikendi_Main_High_Res_@medium.webp',
                high: 'img/maps/vikendi/en/维寒迪-Vikendi_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/vikendi/3602174806_preview_photo_2025-10-20_03-26-13.jpg'
        },
        // 维寒迪：增加加油站
        markerTypes: ['熊洞', '载具', '滑翔机', '撬棍房', '密室', '实验营地', '加油站']
    },
    deston: {
        name: '帝斯顿',
        nameEn: 'Deston',
        images: {
            zh: {
                low: 'img/maps/deston/zh/帝斯顿_@low.webp',
                medium: 'img/maps/deston/zh/帝斯顿_@medium.webp',
                high: 'img/maps/deston/zh/帝斯顿.webp'
            },
            en: {
                low: 'img/maps/deston/en/帝斯顿-Deston_Main_High_Res_@low.webp',
                medium: 'img/maps/deston/en/帝斯顿-Deston_Main_High_Res_@medium.webp',
                high: 'img/maps/deston/en/帝斯顿-Deston_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/deston/3602174806_preview_photo_2025-10-20_03-26-13.jpg'
        },
        // 帝斯顿：增加加油站
        markerTypes: ['安全门', '载具', '滑翔机', '加油站']
    },
    miramar: {
        name: '米拉玛',
        nameEn: 'Miramar',
        images: {
            zh: {
                low: 'img/maps/miramar/zh/米拉玛_@low.webp',
                medium: 'img/maps/miramar/zh/米拉玛_@medium.webp',
                high: 'img/maps/miramar/zh/米拉玛.webp'
            },
            en: {
                low: 'img/maps/miramar/en/米拉玛-Miramar_Main_High_Res_@low.webp',
                medium: 'img/maps/miramar/en/米拉玛-Miramar_Main_High_Res_@medium.webp',
                high: 'img/maps/miramar/en/米拉玛-Miramar_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/miramar/3602174806_preview_photo_2025-10-20_03-26-09.jpg'
        },
        // 米拉玛：增加加油站
        markerTypes: ['载具', '滑翔机', '加油站']
    },
    haven: {
        name: '褐湾',
        nameEn: 'Haven',
        images: {
            zh: {
                low: 'img/maps/haven/zh/褐湾_@low.webp',
                medium: 'img/maps/haven/zh/褐湾_@medium.webp',
                high: 'img/maps/haven/zh/褐湾.webp'
            },
            en: {
                low: 'img/maps/haven/en/褐湾-Haven_Main_High_Res_@low.webp',
                medium: 'img/maps/haven/en/褐湾-Haven_Main_High_Res_@medium.webp',
                high: 'img/maps/haven/en/褐湾-Haven_Main_High_Res.webp'
            }
        },
        markerTypes: []
    },
    karakin: {
        name: '卡拉金',
        nameEn: 'Karakin',
        images: {
            zh: {
                low: 'img/maps/karakin/zh/卡拉金_@low.webp',
                medium: 'img/maps/karakin/zh/卡拉金_@medium.webp',
                high: 'img/maps/karakin/zh/卡拉金.webp'
            },
            en: {
                low: 'img/maps/karakin/en/卡拉金-Karakin_Main_High_Res_@low.webp',
                medium: 'img/maps/karakin/en/卡拉金-Karakin_Main_High_Res_@medium.webp',
                high: 'img/maps/karakin/en/卡拉金-Karakin_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/karakin/3602174806_preview_photo_2025-10-20_03-26-15.jpg'
        },
        markerTypes: ['碉堡']
    },
    paramo: {
        name: '帕拉莫',
        nameEn: 'Paramo',
        images: {
            zh: {
                low: 'img/maps/paramo/zh/帕拉莫_@low.webp',
                medium: 'img/maps/paramo/zh/帕拉莫_@medium.webp',
                high: 'img/maps/paramo/zh/帕拉莫.webp'
            },
            en: {
                low: 'img/maps/paramo/en/帕拉莫-Paramo_Main_High_Res_@low.webp',
                medium: 'img/maps/paramo/en/帕拉莫-Paramo_Main_High_Res_@medium.webp',
                high: 'img/maps/paramo/en/帕拉莫-Paramo_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/paramo/3602174806_preview_photo_2025-10-20_03-26-14.jpg'
        },
        markerTypes: ['密室']
    },
    sanhok: {
        name: '萨诺',
        nameEn: 'Sanhok',
        images: {
            zh: {
                low: 'img/maps/sanhok/zh/萨诺_@low.webp',
                medium: 'img/maps/sanhok/zh/萨诺_@medium.webp',
                high: 'img/maps/sanhok/zh/萨诺.webp'
            },
            en: {
                low: 'img/maps/sanhok/en/萨诺-Sanhok_Main_High_Res_@low.webp',
                medium: 'img/maps/sanhok/en/萨诺-Sanhok_Main_High_Res_@medium.webp',
                high: 'img/maps/sanhok/en/萨诺-Sanhok_Main_High_Res.webp'
            },
            ib: 'img/maps/%23ibakhmet/sanhok/3602174806_preview_sanhok.webp'
        },
        markerTypes: [],
        defaultLanguage: 'ib'
    }
};

// 标记颜色配置
const markerColors = {
    '密室': '#ff6b6b',
    '载具': '#4ecdc4',
    '滑翔机': '#45b7d1',
    '金条': '#ffd700',
    '熊洞': '#ff6b9d',
    '撬棍房': '#c44569',
    '碉堡': '#9fa8da',
    '实验营地': '#a8e6cf',
    '游艇': '#4fc3f7',
    '安全门': '#ffd3b6',
    // 新增：加油站、加电站
    '加油站': '#ffcc80',   // 橙黄色，强调能源点
    '加电站': '#82b1ff',   // 蓝色系，区分于加油站
    '交易点': '#ff8a80'    // 略偏红的颜色，用于交易点
};

// 标记图标路径配置
const markerIconPaths = {
    '密室': 'img/icon/密室.png',
    '载具': 'img/icon/载具.png',
    '滑翔机': 'img/icon/滑翔机.png',
    '金条': 'img/icon/金条.png',
    '熊洞': 'img/icon/熊洞.png',
    '撬棍房': 'img/icon/撬棍房.png',
    '碉堡': 'img/icon/碉堡.png',
    '实验营地': 'img/icon/实验营地.png',
    '安全门': 'img/icon/安全门.png',
    // 预留：加油站
    '加油站': 'img/icon/加油站.png',
    '加电站': 'img/icon/加电站.png',
    '交易点': 'img/icon/交易点.png',
    '游艇': 'img/icon/游艇.png'
};

// 标记数据存储
let markersData = {
    erangel: {},
    taego: {},
    rondo: {},
    vikendi: {},
    deston: {},
    miramar: {},
    haven: {},
    karakin: {},
    paramo: {},
    sanhok: {}
};

// 初始化标记数据结构
function initializeMarkersData() {
    Object.keys(mapConfig).forEach(mapKey => {
        const markerTypes = mapConfig[mapKey].markerTypes;
        markersData[mapKey] = {};
        markerTypes.forEach(type => {
            markersData[mapKey][type] = [];
        });
    });
}

// 校正/补全标记数据结构（用于从本地存储或JSON导入之后）
function normalizeMarkersData() {
    // 确保每个地图都有对象
    Object.keys(mapConfig).forEach(mapKey => {
        if (!markersData[mapKey] || typeof markersData[mapKey] !== 'object') {
            markersData[mapKey] = {};
        }

        const markerTypes = mapConfig[mapKey].markerTypes;
        markerTypes.forEach(type => {
            if (!Array.isArray(markersData[mapKey][type])) {
                markersData[mapKey][type] = [];
            }
        });

        if (mapKey === 'erangel' && Array.isArray(markersData[mapKey]['轮渡']) && markersData[mapKey]['轮渡'].length > 0) {
            if (!Array.isArray(markersData[mapKey]['游艇'])) {
                markersData[mapKey]['游艇'] = [];
            }
            markersData[mapKey]['游艇'] = markersData[mapKey]['游艇'].concat(markersData[mapKey]['轮渡']);
            delete markersData[mapKey]['轮渡'];
        }
    });
}

// 从本地存储加载配置
function loadMarkersFromStorage() {
    const stored = localStorage.getItem('pubgMapMarkers');
    if (stored) {
        try {
            markersData = JSON.parse(stored);
            // 补全新地图/新标记类型的数据结构
            normalizeMarkersData();
        } catch (e) {
            console.error('加载标记数据失败:', e);
            initializeMarkersData();
        }
    } else {
        initializeMarkersData();
    }
}

// 保存配置到本地存储
function saveMarkersToStorage() {
    localStorage.setItem('pubgMapMarkers', JSON.stringify(markersData));
}

// 导出配置为JSON文件
function exportMarkersAsJSON() {
    const dataStr = JSON.stringify(markersData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pubg-markers-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// 从JSON文件导入配置
function importMarkersFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                markersData = imported || {};
                // 导入后也需要补全结构
                normalizeMarkersData();
                saveMarkersToStorage();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file);
    });
}

// 初始化
initializeMarkersData();
loadMarkersFromStorage();
