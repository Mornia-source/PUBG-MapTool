// DOM 元素
const mapSelect = document.getElementById('mapSelect');
const languageButtons = document.querySelectorAll('.lang-btn');
const ibakhmetButton = Array.from(languageButtons).find(btn => btn.dataset.lang === 'ib');
const markerCheckboxes = document.getElementById('markerCheckboxes');
const mapImage = document.getElementById('mapImage');
const mapViewport = document.getElementById('mapViewport');
const mapInner = document.getElementById('mapInner');
const markerCanvas = document.getElementById('markerCanvas');
const exitEditModeBtn = document.getElementById('exitEditModeBtn');
const editControls = document.getElementById('editControls');
const markerTypeGrid = document.getElementById('markerTypeGrid');
const saveConfigBtn = document.getElementById('saveConfigBtn');
const clearMarkersBtn = document.getElementById('clearMarkersBtn');
const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.querySelector('.sidebar');
const zoomSlider = document.getElementById('zoomSlider');
const zoomText = document.getElementById('zoomText');
const resetViewBtn = document.getElementById('resetViewBtn');
const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
const cursorStyleSelect = document.getElementById('cursorStyleSelect');
const fileMenuBtn = document.getElementById('fileMenuBtn');
const fileMenuDropdown = document.getElementById('fileMenuDropdown');
const importConfigBtn = document.getElementById('importConfigBtn');
const exportConfigBtn = document.getElementById('exportConfigBtn');
const importFileInput = document.getElementById('importFileInput');
const configPanel = document.getElementById('configPanel');
const configPanelCloseBtn = document.getElementById('configPanelCloseBtn');
const configPanelContent = document.getElementById('configPanelContent');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const sidebarExpandBtn = document.getElementById('sidebarExpandBtn');
const openConfigPanelBtn = document.getElementById('openConfigPanelBtn');
const mapContextMenu = document.getElementById('mapContextMenu');

// 应用状态
let currentMap = 'erangel';
let currentLanguage = 'zh';
let isEditMode = false;
let baseScale = 1; // 各地图“适配视口”的基准缩放，作为 100%
let mapScale = 1; // 当前实际缩放 = baseScale * 比例
let translateX = 0;
let translateY = 0;
let imageWidth = 0;
let imageHeight = 0;
let isDraggingMap = false;
let dragStartX = 0;
let dragStartY = 0;
let startTranslateX = 0;
let startTranslateY = 0;
let dragDistance = 0; // 记录拖动距离，用于判断是否为拖动操作
let visibleMarkerTypes = new Set();
const markerIconImages = {};
let currentEditMarkerType = null;
let isEditModeClickToPlace = false; // 编辑模式中，true = 单击放置，false = 拖动放置
let isFullscreenMode = false;

// 编辑历史管理
let editHistory = [];
let editHistoryIndex = -1;
const MAX_HISTORY = 50;

// 滚轮缩放加速管理
let lastWheelTime = 0;
let wheelAcceleration = 1;
const WHEEL_ACCELERATION_FACTOR = 1.2;
const WHEEL_DECELERATION_THRESHOLD = 300; // 毫秒

// 地图上选中的标记
let selectedMarker = null; // { type, index }

// 侧边栏宽度/位置动画结束时，重新调整地图画布尺寸，防止图标位置偏移或横向收缩
function handleSidebarTransitionEnd(e) {
    if (e.propertyName === 'width' || e.propertyName === 'transform') {
        resizeCanvas();
    }
}

// 初始化应用
function initApp() {
    setupEventListeners();

    // 小屏设备上默认折叠侧边栏，优先显示地图区域
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }

    // 如果当前地图有默认语言设置，应用它
    const mapConfig_current = mapConfig[currentMap];
    if (mapConfig_current && mapConfig_current.defaultLanguage) {
        currentLanguage = mapConfig_current.defaultLanguage;
        languageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
        });
    }

    updateMarkerCheckboxes();
    updateMarkerTypeSelect();
    preloadMarkerIcons();
    loadMap();
    drawMarkers();
}

// 预加载标记图标
function preloadMarkerIcons() {
    Object.keys(markerIconPaths).forEach(type => {
        const path = markerIconPaths[type];
        const img = new Image();
        img.src = path;
        img.onload = () => {
            drawMarkers();
        };
        markerIconImages[type] = img;
    });
}

// 设置事件监听器
function setupEventListeners() {
    mapSelect.addEventListener('change', handleMapChange);
    languageButtons.forEach(btn => {
        btn.addEventListener('click', handleLanguageButtonClick);
    });
    exitEditModeBtn.addEventListener('click', exitEditMode);
    saveConfigBtn.addEventListener('click', saveConfig);
    clearMarkersBtn.addEventListener('click', clearAllMarkers);
    toggleBtn.addEventListener('click', toggleSidebar);

    // 地图交互
    mapViewport.addEventListener('mousedown', startDragMap);
    document.addEventListener('mousemove', dragMap);
    document.addEventListener('mouseup', stopDragMap);
    mapViewport.addEventListener('wheel', handleZoom, { passive: false });
    mapViewport.addEventListener('contextmenu', handleMapContextMenu);

    // 标记操作
    markerCanvas.addEventListener('click', handleCanvasClick);

    // 标记类型复选框变化
    markerCheckboxes.addEventListener('change', handleMarkerCheckboxChange);

    // 缩放控制
    zoomSlider.addEventListener('input', handleZoomSliderChange);
    resetViewBtn.addEventListener('click', handleResetView);

    // 侧边栏折叠
    sidebarCollapseBtn.addEventListener('click', handleSidebarCollapse);

    // 侧边栏动画结束后，根据新的布局尺寸重新调整画布，避免图标被拉伸/错位
    if (sidebar) {
        sidebar.addEventListener('transitionend', handleSidebarTransitionEnd);
    }

    // 顶部展开侧边栏按钮
    sidebarExpandBtn.addEventListener('click', handleSidebarExpandFromTop);

    // 光标样式
    cursorStyleSelect.addEventListener('change', handleCursorStyleChange);

    // 文件菜单
    fileMenuBtn.addEventListener('click', toggleFileMenu);
    importConfigBtn.addEventListener('click', () => importFileInput.click());
    exportConfigBtn.addEventListener('click', handleExportConfig);
    importFileInput.addEventListener('change', handleImportConfig);

    // 管理面板
    configPanelCloseBtn.addEventListener('click', closeConfigPanel);

    // 全屏按钮
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // 撤回/前一步按钮
    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);

    // 打开管理面板按钮
    openConfigPanelBtn.addEventListener('click', openConfigPanel);

    // 快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // 自定义右键菜单
    if (mapContextMenu) {
        mapContextMenu.addEventListener('click', handleContextMenuClick);
    }
    document.addEventListener('click', handleGlobalClickForContextMenu);

    // 点击外部关闭文件菜单
    document.addEventListener('click', (e) => {
        if (!fileMenuBtn.contains(e.target) && !fileMenuDropdown.contains(e.target)) {
            if (fileMenuDropdown.style.display !== 'none') {
                fileMenuDropdown.style.animation = 'dropdownClose 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    fileMenuDropdown.style.display = 'none';
                    fileMenuDropdown.style.animation = '';
                }, 150);
            }
        }
    });
}

// 侧边栏切换
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

// 地图选择变化
function handleMapChange(e) {
    currentMap = e.target.value;
    // 重置编辑历史
    editHistory = [];
    editHistoryIndex = -1;
    // 退出编辑模式
    if (isEditMode) {
        exitEditMode();
    }

    // 重置地图版本：根据该地图的 defaultLanguage 设置，或默认为 zh（站长汉化）
    const mapConfig_current = mapConfig[currentMap];
    if (mapConfig_current && mapConfig_current.defaultLanguage) {
        currentLanguage = mapConfig_current.defaultLanguage;
    } else {
        currentLanguage = 'zh';  // 默认为站长汉化
    }
    languageButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });

    updateMarkerCheckboxes();
    updateMarkerTypeSelect();
    
    // 检查是否为仅展示地图
    const markerTypes = mapConfig[currentMap].markerTypes;
    const isViewOnlyMap = markerTypes.length === 0;
    const isIbMode = currentLanguage === 'ib';

    if (isIbMode && isEditMode) {
        exitEditMode();
    }

    if (ibakhmetButton) {
        if (currentMap === 'haven') {
            ibakhmetButton.style.display = 'none';
        } else {
            ibakhmetButton.style.display = '';
        }
    }
    
    loadMap();
    updateConfigPanel();
    // loadMap() 会在 onload 中调用 resetMapView() 和 drawMarkers()，不需要重复调用
}

// 语言按钮切换（切换后重置缩放和位置）
function handleLanguageButtonClick(e) {
    const lang = e.currentTarget.dataset.lang;
    if (!lang || lang === currentLanguage) return;

    currentLanguage = lang;

    languageButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const markerTypes = mapConfig[currentMap].markerTypes;
    const isViewOnlyMap = markerTypes.length === 0;
    const isIbMode = currentLanguage === 'ib';

    if (isIbMode && isEditMode) {
        exitEditMode();
    }

    const mapKey = currentMap;
    const images = mapConfig[mapKey].images;
    let langImages;
    if (currentLanguage === 'ib') {
        // ibakhmet 模式：优先使用 ib 专用图片，没有则退回到游戏原版
        langImages = images.ib || images.en;
    } else {
        langImages = images[currentLanguage];
    }
    
    // 获取当前缩放百分比
    const zoomPercent = Math.round((mapScale / baseScale) * 100);
    const resolution = getOptimalResolution(zoomPercent);
    
    // 获取对应分辨率的图片路径
    const imagePath = typeof langImages === 'string' 
        ? langImages
        : langImages[resolution];
    
    mapImage.src = imagePath;
    mapImage.onload = () => {
        imageWidth = mapImage.naturalWidth;
        imageHeight = mapImage.naturalHeight;
        // 重置视图到默认状态
        resetMapView();
    };
}

// 更新标记类型复选框
function updateMarkerCheckboxes() {
    markerCheckboxes.innerHTML = '';
    visibleMarkerTypes = new Set();
    const markerTypes = mapConfig[currentMap].markerTypes;

    // 维寒迪、荣都：菜单中的标记类型允许多行；其他地图：强制单行横向
    if (currentMap === 'vikendi' || currentMap === 'rondo') {
        markerCheckboxes.classList.add('multi-row');
    } else {
        markerCheckboxes.classList.remove('multi-row');
    }
    
    // 如果没有标记类型（仅展示地图），显示提示信息
    if (markerTypes.length === 0) {
        const hint = document.createElement('p');
        hint.style.fontSize = '12px';
        hint.style.color = '#999';
        hint.style.fontStyle = 'italic';
        hint.textContent = '此地图仅供展示，无标记点';
        markerCheckboxes.appendChild(hint);
        return;
    }
    
    markerTypes.forEach(type => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `marker-${type}`;
        checkbox.value = type;

        // 默认勾选，只有荣都的“金条”在初始时不勾选
        let defaultChecked = true;
        if (currentMap === 'rondo' && type === '金条') {
            defaultChecked = false;
        }
        checkbox.checked = defaultChecked;
        
        const iconImg = document.createElement('img');
        iconImg.className = 'marker-icon-img';
        iconImg.src = markerIconPaths[type] || '';
        
        const label = document.createElement('label');
        label.htmlFor = `marker-${type}`;
        label.textContent = type;
        
        div.appendChild(checkbox);
        div.appendChild(iconImg);
        div.appendChild(label);
        markerCheckboxes.appendChild(div);

        if (checkbox.checked) {
            div.classList.add('active');
            visibleMarkerTypes.add(type);
        }

        // 点击整块切换显示状态
        div.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
}

// 更新编辑模式标记类型选择
function updateMarkerTypeSelect() {
    if (!markerTypeGrid) return;
    markerTypeGrid.innerHTML = '';
    const markerTypes = mapConfig[currentMap].markerTypes;

    // 维寒迪、荣都：编辑模式下使用多行布局；其它地图强制单行
    if (currentMap === 'vikendi' || currentMap === 'rondo') {
        markerTypeGrid.classList.remove('single-row');
    } else {
        markerTypeGrid.classList.add('single-row');
    }

    currentEditMarkerType = markerTypes[0] || null;

    markerTypes.forEach(type => {
        const item = document.createElement('div');
        item.className = 'marker-type-item';

        const iconImg = document.createElement('img');
        iconImg.className = 'marker-type-icon-img';
        iconImg.src = markerIconPaths[type] || '';

        const name = document.createElement('div');
        name.className = 'marker-type-name';
        name.textContent = type;

        item.appendChild(iconImg);
        item.appendChild(name);
        markerTypeGrid.appendChild(item);

        if (type === currentEditMarkerType) {
            item.classList.add('active');
        }

        item.addEventListener('click', () => {
            currentEditMarkerType = type;
            Array.from(markerTypeGrid.children).forEach(child => {
                child.classList.toggle('active', child === item);
            });
        });
    });
}

// 根据缩放级别选择合适的分辨率
function getOptimalResolution(zoomPercent) {
    if (zoomPercent <= 200) {
        return 'low';      // 100-200%: 2048x2048
    } else if (zoomPercent <= 1000) {
        return 'medium';   // 200-1000%: 4096x4096
    } else {
        return 'high';     // 1000%+: 8192x8192
    }
}

// 加载地图图片（支持动态分辨率）
function loadMap() {
    const mapKey = currentMap;
    const images = mapConfig[mapKey].images;
    let langImages;
    if (currentLanguage === 'ib') {
        // ibakhmet 模式：优先使用 ib 专用图片，没有则退回到游戏原版
        langImages = images.ib || images.en;
    } else {
        langImages = images[currentLanguage];
    }
    
    // 获取当前缩放百分比
    const zoomPercent = Math.round((mapScale / baseScale) * 100);
    const resolution = getOptimalResolution(zoomPercent);
    
    // 获取对应分辨率的图片路径
    const imagePath = typeof langImages === 'string' 
        ? langImages  // 兼容旧格式
        : langImages[resolution];
    
    mapImage.src = imagePath;
    mapImage.onload = () => {
        imageWidth = mapImage.naturalWidth;
        imageHeight = mapImage.naturalHeight;
        resetMapView();
        drawMarkers();
    };
}

// 处理标记类型复选框变化
function handleMarkerCheckboxChange(e) {
    if (e.target.type === 'checkbox') {
        const markerType = e.target.value;
        const container = e.target.closest('.checkbox-item');
        if (e.target.checked) {
            visibleMarkerTypes.add(markerType);
            if (container) container.classList.add('active');
        } else {
            visibleMarkerTypes.delete(markerType);
            if (container) container.classList.remove('active');
        }
        drawMarkers();
    }
}

// 进入编辑模式
function enterEditMode() {
    const markerTypes = mapConfig[currentMap].markerTypes;
    const isViewOnlyMap = markerTypes.length === 0;
    const isIbMode = currentLanguage === 'ib';

    // 仅展示地图或 ib 模式下禁止进入编辑模式
    if (isViewOnlyMap || isIbMode) {
        return;
    }

    isEditMode = true;
    isEditModeClickToPlace = true; // 编辑模式中单击放置
    exitEditModeBtn.style.display = 'block';
    editControls.style.display = 'block';
    markerCanvas.classList.remove('hidden');
    mapImage.style.opacity = '0.7';
    mapViewport.style.cursor = 'crosshair';
}

// 退出编辑模式
function exitEditMode() {
    isEditMode = false;
    isEditModeClickToPlace = false;
    exitEditModeBtn.style.display = 'none';
    editControls.style.display = 'none';
    markerCanvas.classList.add('hidden');
    mapImage.style.opacity = '1';
    mapViewport.style.cursor = 'default';
}

// 保存配置
function saveConfig() {
    saveMarkersToStorage();
    alert('配置已保存！');
}

// 清除所有标记
function clearAllMarkers() {
    if (confirm('确定要清除当前地图的所有标记吗？')) {
        const markerTypes = mapConfig[currentMap].markerTypes;
        markerTypes.forEach(type => {
            markersData[currentMap][type] = [];
        });
        saveToHistory();
        saveMarkersToStorage();
        drawMarkers();
    }
}

// 处理画布点击（添加标记或选中标记）
function handleCanvasClick(e) {
    if (currentLanguage === 'ib') return;
    const viewportRect = mapViewport.getBoundingClientRect();
    const mouseX = e.clientX - viewportRect.left;
    const mouseY = e.clientY - viewportRect.top;

    // 如果发生了拖动（距离 > 5px），不处理
    if (dragDistance > 5) return;

    // 尝试选中标记（非编辑模式或编辑模式都可以）
    const clickedMarker = getMarkerAtPosition(mouseX, mouseY);
    if (clickedMarker) {
        selectMarker(clickedMarker);
        return;
    }

    // 编辑模式下，单击放置标记
    if (!isEditMode || !isEditModeClickToPlace) return;

    // 将屏幕坐标转换为图片内的世界坐标
    const worldX = (mouseX - translateX) / mapScale;
    const worldY = (mouseY - translateY) / mapScale;

    // 限制只能落在图片范围内
    if (
        worldX < 0 ||
        worldY < 0 ||
        worldX > imageWidth ||
        worldY > imageHeight
    ) {
        return;
    }

    // 归一化到 0-1
    const nx = worldX / imageWidth;
    const ny = worldY / imageHeight;

    const markerType = currentEditMarkerType || (mapConfig[currentMap].markerTypes[0] || '');
    if (!markerType) return;
    const marker = {
        nx,
        ny,
        timestamp: new Date().toISOString()
    };

    markersData[currentMap][markerType].push(marker);
    saveToHistory();
    saveMarkersToStorage();
    drawMarkers();
    updateConfigPanel();
}

// 绘制标记（使用图标图片，大小不随地图缩放改变）
function drawMarkers() {
    const ctx = markerCanvas.getContext('2d');
    ctx.clearRect(0, 0, markerCanvas.width, markerCanvas.height);

    if (!imageWidth || !imageHeight) return;
    if (currentLanguage === 'ib') return;

    const viewportRect = mapViewport.getBoundingClientRect();
    if (!viewportRect.width || !viewportRect.height) return;

    const markerTypes = mapConfig[currentMap].markerTypes;
    
    markerTypes.forEach(type => {
        if (!visibleMarkerTypes.has(type)) return;

        const markers = markersData[currentMap][type] || [];
        const iconImg = markerIconImages[type];
        if (!iconImg || !iconImg.complete) return;

        const naturalW = iconImg.naturalWidth || 1;
        const naturalH = iconImg.naturalHeight || 1;
        const naturalRatio = naturalW / naturalH;

        markers.forEach((marker, index) => {
            if (marker.nx == null || marker.ny == null) return;

            // 地图内的基础坐标（图片像素坐标）
            const baseX = marker.nx * imageWidth;
            const baseY = marker.ny * imageHeight;

            // 转换为视口中的屏幕坐标：应用当前平移和缩放
            const screenX = translateX + baseX * mapScale;
            const screenY = translateY + baseY * mapScale;

            // 图标大小固定，不随地图缩放改变，保持原始宽高比
            const fixedIconSize = 32; // 固定像素大小
            let iconWidth, iconHeight;
            if (naturalW >= naturalH) {
                iconWidth = fixedIconSize;
                iconHeight = fixedIconSize / naturalRatio;
            } else {
                iconHeight = fixedIconSize;
                iconWidth = fixedIconSize * naturalRatio;
            }

            // 让图标底部中心对准地图点位
            const drawX = screenX - iconWidth / 2;
            const drawY = screenY - iconHeight;

            ctx.drawImage(iconImg, drawX, drawY, iconWidth, iconHeight);

            // 如果这个标记被选中，绘制高亮效果
            if (selectedMarker && selectedMarker.type === type && selectedMarker.index === index) {
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 3;
                ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
                ctx.shadowBlur = 10;
                ctx.strokeRect(drawX - 2, drawY - 2, iconWidth + 4, iconHeight + 4);
                ctx.shadowColor = 'transparent';
            }
        });
    });
}

// 调整画布大小
function resizeCanvas() {
    const viewportRect = mapViewport.getBoundingClientRect();
    if (!viewportRect.width || !viewportRect.height) return;
    markerCanvas.width = viewportRect.width;
    markerCanvas.height = viewportRect.height;
    drawMarkers();
}

// 地图拖拽
function startDragMap(e) {
    // 编辑模式中也允许拖动地图
    isDraggingMap = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    startTranslateX = translateX;
    startTranslateY = translateY;
    dragDistance = 0; // 重置拖动距离
    mapInner.style.transition = 'none';
    mapViewport.classList.add('dragging');
}

function dragMap(e) {
    if (!isDraggingMap) return;

    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 计算拖动距离
    translateX = startTranslateX + deltaX;
    translateY = startTranslateY + deltaY;
    mapInner.style.transition = 'none';
    applyTransform();
    drawMarkers();
}

function stopDragMap() {
    if (!isDraggingMap) return;
    isDraggingMap = false;
    mapViewport.classList.remove('dragging');
}

// 地图缩放（滚轮）
function handleZoom(e) {
    e.preventDefault();

    if (!imageWidth || !imageHeight) return;

    const now = Date.now();
    const timeSinceLastWheel = now - lastWheelTime;

    // 计算加速度：连续滚动时加速，停止后逐渐减速
    if (timeSinceLastWheel < WHEEL_DECELERATION_THRESHOLD) {
        wheelAcceleration = Math.min(wheelAcceleration * WHEEL_ACCELERATION_FACTOR, 3); // 最大加速 3 倍
    } else {
        wheelAcceleration = 1; // 重置加速度
    }

    lastWheelTime = now;

    // 基础缩放速度分档：
    //  - 当前缩放 ≤ 500%：每档约 25%
    //  - 500% < 缩放 ≤ 1000%：每档约 50%
    //  - 缩放 > 1000%：每档约 100%
    let baseZoomSpeed = 0.25;
    const currentRatio = mapScale / baseScale;
    const currentZoomPercent = currentRatio * 100;
    if (currentZoomPercent > 1000) {
        baseZoomSpeed = 1.0;
    } else if (currentZoomPercent > 500) {
        baseZoomSpeed = 0.5;
    }

    const zoomSpeed = baseZoomSpeed * wheelAcceleration;
    const direction = e.deltaY > 0 ? -1 : 1;
    let newRatio = currentRatio + direction * zoomSpeed;

    // 限制范围：100% ~ 2000%
    newRatio = Math.max(1, Math.min(20, newRatio));

    if (newRatio === currentRatio) return;

    const viewportRect = mapViewport.getBoundingClientRect();
    const mouseX = e.clientX - viewportRect.left;
    const mouseY = e.clientY - viewportRect.top;

    // 缩放前的世界坐标（基于图片像素坐标）
    const worldX = (mouseX - translateX) / mapScale;
    const worldY = (mouseY - translateY) / mapScale;

    mapScale = baseScale * newRatio;

    // 调整平移以保持鼠标下的点不动
    translateX = mouseX - worldX * mapScale;
    translateY = mouseY - worldY * mapScale;

    // 滚轮缩放使用较短的平滑过渡动画
    mapInner.style.transition = 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    applyTransform();
    updateZoomDisplay();
    drawMarkers();
}

// 重置地图视图
function resetMapView() {
    if (!imageWidth || !imageHeight) return;

    const viewportRect = mapViewport.getBoundingClientRect();
    if (!viewportRect.width || !viewportRect.height) return;

    const scaleX = viewportRect.width / imageWidth;
    const scaleY = viewportRect.height / imageHeight;
    baseScale = Math.min(scaleX, scaleY);
    mapScale = baseScale;

    const contentWidth = imageWidth * mapScale;
    const contentHeight = imageHeight * mapScale;

    translateX = (viewportRect.width - contentWidth) / 2;
    translateY = (viewportRect.height - contentHeight) / 2;

    // 复位时使用稍长的平滑过渡动画
    mapInner.style.transition = 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    applyTransform();
    updateZoomDisplay();
    resizeCanvas();
}

// 应用当前平移和缩放到地图容器
function applyTransform() {
    mapInner.style.transform = `translate(${translateX}px, ${translateY}px) scale(${mapScale})`;
}

// 处理缩放滑块变化
function handleZoomSliderChange(e) {
    const zoomPercent = parseInt(e.target.value);
    const newRatio = zoomPercent / 100;

    // 计算视口中心
    const viewportRect = mapViewport.getBoundingClientRect();
    const centerX = viewportRect.width / 2;
    const centerY = viewportRect.height / 2;

    // 缩放前的世界坐标
    const worldX = (centerX - translateX) / mapScale;
    const worldY = (centerY - translateY) / mapScale;

    // 应用新的缩放（基于 baseScale）
    mapScale = baseScale * newRatio;

    // 调整平移以保持视口中心不动
    translateX = centerX - worldX * mapScale;
    translateY = centerY - worldY * mapScale;

    // 更新文本显示
    zoomText.value = `${zoomPercent}%`;

    // 滑块拖动时使用平滑过渡
    mapInner.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    applyTransform();
    drawMarkers();
}

// 更新缩放滑块和文本（当通过滚轮或其他方式改变缩放时）
function updateZoomDisplay() {
    if (!baseScale) return;
    const zoomPercent = Math.round((mapScale / baseScale) * 100);
    zoomSlider.value = zoomPercent;
    zoomText.value = `${zoomPercent}%`;
}

// 处理复位视图按钮
function handleResetView() {
    resetMapView();
}

// 侧边栏折叠
function handleSidebarCollapse() {
    sidebar.classList.toggle('collapsed');
    sidebarCollapseBtn.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
}

// 顶部展开侧边栏
function handleSidebarExpandFromTop() {
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        sidebarCollapseBtn.textContent = '◀';
    }
}

// 光标样式变化
function handleCursorStyleChange(e) {
    const cursorStyle = e.target.value;
    mapViewport.style.cursor = cursorStyle;
}

// 处理地图区域右键：仅拦截浏览器默认菜单，不显示任何自定义菜单
function handleMapContextMenu(e) {
    e.preventDefault();
}

// 处理自定义菜单点击（切换地图）
function handleContextMenuClick(e) {
    const item = e.target.closest('.context-menu-item');
    if (!item) return;
    const mapKey = item.dataset.map;
    if (!mapKey) return;

    mapSelect.value = mapKey;
    mapSelect.dispatchEvent(new Event('change'));

    mapContextMenu.style.display = 'none';
}

// 点击页面其它位置时关闭自定义菜单
function handleGlobalClickForContextMenu(e) {
    if (!mapContextMenu) return;
    if (mapContextMenu.style.display === 'none') return;
    if (!mapContextMenu.contains(e.target)) {
        mapContextMenu.style.display = 'none';
    }
}

// 文件菜单切换
function toggleFileMenu() {
    const isVisible = fileMenuDropdown.style.display !== 'none';
    if (isVisible) {
        // 关闭菜单：播放关闭动画后隐藏
        fileMenuDropdown.style.animation = 'dropdownClose 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
            fileMenuDropdown.style.display = 'none';
            fileMenuDropdown.style.animation = '';
        }, 150);
    } else {
        // 打开菜单
        fileMenuDropdown.style.display = 'block';
        fileMenuDropdown.style.animation = 'dropdownOpen 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
}

// 导出配置
function handleExportConfig() {
    const dataToExport = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        markers: markersData
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pubg-markers-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    fileMenuDropdown.style.display = 'none';
}

// 导入配置
function handleImportConfig(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            let importedMarkers = null;

            // 新版导出格式：{ markers: { erangel: {...}, ... } }
            if (data && typeof data === 'object' && data.markers && typeof data.markers === 'object') {
                importedMarkers = data.markers;
            } else if (data && typeof data === 'object') {
                // 兼容旧版：直接就是 markersData 结构（包含各地图键）
                const possibleMapKeys = ['erangel', 'taego', 'rondo', 'vikendi', 'deston', 'miramar', 'haven', 'karakin', 'paramo', 'sanhok'];
                const hasAnyMapKey = possibleMapKeys.some(k => Object.prototype.hasOwnProperty.call(data, k));
                if (hasAnyMapKey) {
                    importedMarkers = data;
                }
            }

            if (importedMarkers) {
                // 应用导入的数据
                markersData = importedMarkers || {};
                // 补全结构 & 执行迁移（如 轮渡 -> 游艇）
                if (typeof normalizeMarkersData === 'function') {
                    normalizeMarkersData();
                }
                saveMarkersToStorage();
                drawMarkers();
                updateConfigPanel();
                alert('配置导入成功！');
            } else {
                alert('无效的配置文件格式');
            }
        } catch (error) {
            alert('导入失败：' + error.message);
        }
    };
    reader.readAsText(file);
    importFileInput.value = '';
    fileMenuDropdown.style.display = 'none';
}

// 更新管理面板
function updateConfigPanel() {
    configPanelContent.innerHTML = '';
    const markerTypes = mapConfig[currentMap].markerTypes;
    const allMarkers = [];

    // 收集所有标记
    markerTypes.forEach(type => {
        const markers = markersData[currentMap][type] || [];
        markers.forEach((marker, index) => {
            allMarkers.push({
                type,
                index,
                name: `${type}#${index + 1}`
            });
        });
    });

    // 按名称排序
    allMarkers.sort((a, b) => a.name.localeCompare(b.name));

    // 显示标记列表
    if (allMarkers.length === 0) {
        configPanelContent.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">暂无标记</p>';
        return;
    }

    allMarkers.forEach(item => {
        const markerItem = document.createElement('div');
        markerItem.className = 'marker-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'marker-item-name';
        nameSpan.textContent = item.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'marker-item-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => {
            markersData[currentMap][item.type].splice(item.index, 1);
            if (isEditMode) {
                saveToHistory();
            }
            saveMarkersToStorage();
            drawMarkers();
            updateConfigPanel();
        });

        markerItem.appendChild(nameSpan);
        markerItem.appendChild(deleteBtn);
        configPanelContent.appendChild(markerItem);
    });
}

// 打开管理面板
function openConfigPanel() {
    configPanel.classList.add('open');
    updateConfigPanel();
}

// 关闭管理面板
function closeConfigPanel() {
    configPanel.classList.remove('open');
}

// 编辑历史管理
function saveToHistory() {
    // 删除当前位置之后的历史
    editHistory = editHistory.slice(0, editHistoryIndex + 1);
    
    // 保存当前状态
    editHistory.push(JSON.parse(JSON.stringify(markersData)));
    editHistoryIndex++;
    
    // 限制历史记录数量
    if (editHistory.length > MAX_HISTORY) {
        editHistory.shift();
        editHistoryIndex--;
    }
    
    updateHistoryButtons();
}

function handleUndo() {
    if (editHistoryIndex > 0) {
        editHistoryIndex--;
        markersData = JSON.parse(JSON.stringify(editHistory[editHistoryIndex]));
        saveMarkersToStorage();
        drawMarkers();
        updateConfigPanel();
        updateHistoryButtons();
    }
}

function handleRedo() {
    if (editHistoryIndex < editHistory.length - 1) {
        editHistoryIndex++;
        markersData = JSON.parse(JSON.stringify(editHistory[editHistoryIndex]));
        saveMarkersToStorage();
        drawMarkers();
        updateConfigPanel();
        updateHistoryButtons();
    }
}

function updateHistoryButtons() {
    undoBtn.disabled = editHistoryIndex <= 0;
    redoBtn.disabled = editHistoryIndex >= editHistory.length - 1;
}

// 全屏功能
function toggleFullscreen() {
    isFullscreenMode = !isFullscreenMode;
    document.body.classList.toggle('fullscreen-mode', isFullscreenMode);
    fullscreenBtn.style.color = isFullscreenMode ? '#ff9500' : '#e0e0e0';
    
    // 重新调整地图大小
    setTimeout(() => {
        resizeCanvas();
    }, 100);
}

// 快捷键处理
function handleKeyboardShortcuts(e) {
    // F2：切换编辑模式
    if (e.key === 'F2') {
        e.preventDefault();

        const markerTypes = mapConfig[currentMap].markerTypes;
        const isViewOnlyMap = markerTypes.length === 0;
        const isIbMode = currentLanguage === 'ib';

        // 仅展示地图或 ib 模式下禁止进入编辑模式
        if (isViewOnlyMap || isIbMode) {
            return;
        }

        if (isEditMode) {
            exitEditMode();
        } else {
            enterEditMode();
        }
        return;
    }

    // F11 全屏
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Ctrl+Z 撤回
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (isEditMode) {
            handleUndo();
        }
    }
    
    // Ctrl+Y 前一步
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (isEditMode) {
            handleRedo();
        }
    }
}

// 获取鼠标位置处的标记
function getMarkerAtPosition(mouseX, mouseY) {
    const markerTypes = mapConfig[currentMap].markerTypes;
    const clickRadius = 20; // 点击半径（像素）

    for (let type of markerTypes) {
        if (!visibleMarkerTypes.has(type)) continue;

        const markers = markersData[currentMap][type] || [];
        const iconImg = markerIconImages[type];
        if (!iconImg || !iconImg.complete) continue;

        const naturalW = iconImg.naturalWidth || 1;
        const naturalH = iconImg.naturalHeight || 1;
        const naturalRatio = naturalW / naturalH;

        for (let index = 0; index < markers.length; index++) {
            const marker = markers[index];
            if (marker.nx == null || marker.ny == null) continue;

            // 地图内的基础坐标（图片像素坐标）
            const baseX = marker.nx * imageWidth;
            const baseY = marker.ny * imageHeight;

            // 转换为视口中的屏幕坐标
            const screenX = translateX + baseX * mapScale;
            const screenY = translateY + baseY * mapScale;

            // 计算图标大小
            const fixedIconSize = 32;
            let iconWidth, iconHeight;
            if (naturalW >= naturalH) {
                iconWidth = fixedIconSize;
                iconHeight = fixedIconSize / naturalRatio;
            } else {
                iconHeight = fixedIconSize;
                iconWidth = fixedIconSize * naturalRatio;
            }

            // 图标底部中心对准地图点位
            const drawX = screenX - iconWidth / 2;
            const drawY = screenY - iconHeight;

            // 检查点击是否在图标范围内（扩大点击区域）
            if (
                mouseX >= drawX - clickRadius &&
                mouseX <= drawX + iconWidth + clickRadius &&
                mouseY >= drawY - clickRadius &&
                mouseY <= drawY + iconHeight + clickRadius
            ) {
                return { type, index };
            }
        }
    }

    return null;
}

// 选中标记
function selectMarker(markerInfo) {
    selectedMarker = markerInfo;
    drawMarkers();
    
    // 显示删除提示
    const markerType = markerInfo.type;
    const markerIndex = markerInfo.index;
    const markerName = `${markerType}#${markerIndex + 1}`;
    
    // 显示确认删除对话框
    if (confirm(`选中标记：${markerName}\n点击"确定"删除该标记`)) {
        deleteSelectedMarker();
    } else {
        selectedMarker = null;
        drawMarkers();
    }
}

// 删除选中的标记
function deleteSelectedMarker() {
    if (!selectedMarker) return;

    const { type, index } = selectedMarker;
    markersData[currentMap][type].splice(index, 1);
    
    if (isEditMode) {
        saveToHistory();
    }
    saveMarkersToStorage();
    
    selectedMarker = null;
    drawMarkers();
    updateConfigPanel();
}

// 监听窗口大小变化
window.addEventListener('resize', resetMapView);

// 启动应用
initApp();
