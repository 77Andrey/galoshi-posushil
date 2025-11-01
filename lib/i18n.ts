export type Language = 'en' | 'ru' | 'th'

export interface Translations {
  // Header
  title: string
  subtitle: string
  scenarios: string
  export: string
  shortcuts: string
  share: string
  
  // Key Metrics
  tradeVolume: string
  atRisk: string
  disruptions: string
  avgDelay: string
  estLosses: string
  criticalPoints: string
  
  // Map
  globalTradeRoutes: string
  liveData: string
  selectRoute: string
  routeDetails: string
  status: string
  riskLevel: string
  volume: string
  commodity: string
  alternatives: string
  chokepointsPassed: string
  geopoliticalFactors: string
  viewFullAnalysis: string
  clickToView: string
  
  // Routes Table
  tradeRoutes: string
  searchRoutes: string
  allStatuses: string
  active: string
  atRiskStatus: string
  disrupted: string
  allRiskLevels: string
  low: string
  medium: string
  high: string
  critical: string
  allCommodities: string
  route: string
  originDestination: string
  showing: string
  of: string
  totalVolume: string
  
  // Risks Panel
  intelligenceFeed: string
  risks: string
  opportunities: string
  clearFilters: string
  copied: string
  
  // Scenarios
  scenarioPlanning: string
  simulateScenarios: string
  activate: string
  deactivateScenario: string
  activateScenario: string
  selectScenario: string
  chooseScenario: string
  clearAll: string
  activeScenarios: string
  probability: string
  timeline: string
  impactAnalysis: string
  volumeChange: string
  delayIncrease: string
  costImpact: string
  affectedRoutes: string
  affectedChokepoints: string
  mitigationStrategies: string
  calculationFormulas: string
  volumeAdjustment: string
  deliveryTimeImpact: string
  costMultiplier: string
  currencyImpact: string
  riskPremium: string
  
  // Export
  exportData: string
  chooseFormat: string
  exportFormat: string
  recommended: string
  includeData: string
  exportSummary: string
  datasetsSelected: string
  exportButton: string
  exportedSuccessfully: string
}

export const translations: Record<Language, Translations> = {
  en: {
    title: 'Trade Superhighways',
    subtitle: 'Global Trade Intelligence & Risk Analysis',
    scenarios: 'Scenarios',
    export: 'Export',
    shortcuts: 'Shortcuts',
    share: 'Share',
    
    tradeVolume: 'Trade Volume',
    atRisk: 'At Risk',
    disruptions: 'Disruptions',
    avgDelay: 'Avg Delay',
    estLosses: 'Est. Losses',
    criticalPoints: 'Critical Points',
    
    globalTradeRoutes: 'Global Trade Routes',
    liveData: 'Live Data',
    selectRoute: 'Select a Route',
    routeDetails: 'Route Details',
    status: 'Status',
    riskLevel: 'Risk Level',
    volume: 'Volume',
    commodity: 'Commodity',
    alternatives: 'Alternatives',
    chokepointsPassed: 'Chokepoints Passed',
    geopoliticalFactors: 'Geopolitical Factors',
    viewFullAnalysis: 'View Full Analysis',
    clickToView: 'Click on a trade route or chokepoint on the map to view detailed information',
    
    tradeRoutes: 'Trade Routes',
    searchRoutes: 'Search routes...',
    allStatuses: 'All Statuses',
    active: 'Active',
    atRiskStatus: 'At Risk',
    disrupted: 'Disrupted',
    allRiskLevels: 'All Risk Levels',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    allCommodities: 'All Commodities',
    route: 'Route',
    originDestination: 'Origin → Destination',
    showing: 'Showing',
    of: 'of',
    totalVolume: 'Total Volume',
    
    intelligenceFeed: 'Intelligence Feed',
    risks: 'Risks',
    opportunities: 'Opportunities',
    clearFilters: 'Clear Filters',
    copied: 'Copied!',
    
    scenarioPlanning: 'Scenario Planning',
    simulateScenarios: 'Simulate geopolitical scenarios and analyze their impact on global trade routes',
    activate: 'Activate',
    deactivateScenario: 'Deactivate Scenario',
    activateScenario: 'Activate Scenario',
    selectScenario: 'Select a Scenario',
    chooseScenario: 'Choose a scenario from the list to view detailed impact analysis and mitigation strategies',
    clearAll: 'Clear All',
    activeScenarios: 'Active Scenarios',
    probability: 'Probability',
    timeline: 'Timeline',
    impactAnalysis: 'Impact Analysis',
    volumeChange: 'Volume Change',
    delayIncrease: 'Delay Increase',
    costImpact: 'Cost Impact',
    affectedRoutes: 'Affected Routes',
    affectedChokepoints: 'Affected Chokepoints',
    mitigationStrategies: 'Mitigation Strategies',
    calculationFormulas: 'Calculation Formulas',
    volumeAdjustment: 'Volume Adjustment',
    deliveryTimeImpact: 'Delivery Time Impact',
    costMultiplier: 'Cost Multiplier',
    currencyImpact: 'Currency Impact',
    riskPremium: 'Risk Premium',
    
    exportData: 'Export Data',
    chooseFormat: 'Choose the format and data to export',
    exportFormat: 'Export Format',
    recommended: 'Recommended',
    includeData: 'Include Data',
    exportSummary: 'Export Summary',
    datasetsSelected: 'datasets selected',
    exportButton: 'Export Data',
    exportedSuccessfully: 'Exported Successfully',
  },
  ru: {
    title: 'Торговые Сверхмагистрали',
    subtitle: 'Глобальная Аналитика Торговли и Рисков',
    scenarios: 'Сценарии',
    export: 'Экспорт',
    shortcuts: 'Горячие клавиши',
    share: 'Поделиться',
    
    tradeVolume: 'Объём торговли',
    atRisk: 'Под риском',
    disruptions: 'Сбои',
    avgDelay: 'Средняя задержка',
    estLosses: 'Оценочные потери',
    criticalPoints: 'Критические точки',
    
    globalTradeRoutes: 'Глобальные торговые пути',
    liveData: 'Данные в реальном времени',
    selectRoute: 'Выберите путь',
    routeDetails: 'Детали пути',
    status: 'Статус',
    riskLevel: 'Уровень риска',
    volume: 'Объём',
    commodity: 'Товар',
    alternatives: 'Альтернативы',
    chokepointsPassed: 'Пройденные узкие места',
    geopoliticalFactors: 'Геополитические факторы',
    viewFullAnalysis: 'Просмотреть полный анализ',
    clickToView: 'Нажмите на торговый путь или узкое место на карте для просмотра подробной информации',
    
    tradeRoutes: 'Торговые пути',
    searchRoutes: 'Поиск путей...',
    allStatuses: 'Все статусы',
    active: 'Активен',
    atRiskStatus: 'Под риском',
    disrupted: 'Нарушен',
    allRiskLevels: 'Все уровни риска',
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический',
    allCommodities: 'Все товары',
    route: 'Путь',
    originDestination: 'Откуда → Куда',
    showing: 'Показано',
    of: 'из',
    totalVolume: 'Общий объём',
    
    intelligenceFeed: 'Лента разведданных',
    risks: 'Риски',
    opportunities: 'Возможности',
    clearFilters: 'Очистить фильтры',
    copied: 'Скопировано!',
    
    scenarioPlanning: 'Планирование сценариев',
    simulateScenarios: 'Моделируйте геополитические сценарии и анализируйте их влияние на глобальные торговые пути',
    activate: 'Активировать',
    deactivateScenario: 'Деактивировать сценарий',
    activateScenario: 'Активировать сценарий',
    selectScenario: 'Выберите сценарий',
    chooseScenario: 'Выберите сценарий из списка для просмотра детального анализа воздействия и стратегий смягчения',
    clearAll: 'Очистить всё',
    activeScenarios: 'Активные сценарии',
    probability: 'Вероятность',
    timeline: 'Временные рамки',
    impactAnalysis: 'Анализ воздействия',
    volumeChange: 'Изменение объёма',
    delayIncrease: 'Увеличение задержки',
    costImpact: 'Влияние на стоимость',
    affectedRoutes: 'Затронутые пути',
    affectedChokepoints: 'Затронутые узкие места',
    mitigationStrategies: 'Стратегии смягчения',
    calculationFormulas: 'Формулы расчёта',
    volumeAdjustment: 'Корректировка объёма',
    deliveryTimeImpact: 'Влияние на время доставки',
    costMultiplier: 'Множитель стоимости',
    currencyImpact: 'Валютное влияние',
    riskPremium: 'Рисковая премия',
    
    exportData: 'Экспорт данных',
    chooseFormat: 'Выберите формат и данные для экспорта',
    exportFormat: 'Формат экспорта',
    recommended: 'Рекомендуется',
    includeData: 'Включить данные',
    exportSummary: 'Сводка экспорта',
    datasetsSelected: 'наборов данных выбрано',
    exportButton: 'Экспортировать данные',
    exportedSuccessfully: 'Экспортировано успешно',
  },
  th: {
    title: 'ทางด่วนการค้า',
    subtitle: 'ข้อมูลข่าวกรองการค้าโลกและการวิเคราะห์ความเสี่ยง',
    scenarios: 'สถานการณ์',
    export: 'ส่งออก',
    shortcuts: 'ปุ่มลัด',
    share: 'แบ่งปัน',
    
    tradeVolume: 'ปริมาณการค้า',
    atRisk: 'เสี่ยง',
    disruptions: 'การหยุดชะงัก',
    avgDelay: 'ความล่าช้าเฉลี่ย',
    estLosses: 'ความสูญเสียโดยประมาณ',
    criticalPoints: 'จุดวิกฤต',
    
    globalTradeRoutes: 'เส้นทางการค้าทั่วโลก',
    liveData: 'ข้อมูลสด',
    selectRoute: 'เลือกเส้นทาง',
    routeDetails: 'รายละเอียดเส้นทาง',
    status: 'สถานะ',
    riskLevel: 'ระดับความเสี่ยง',
    volume: 'ปริมาณ',
    commodity: 'สินค้า',
    alternatives: 'ทางเลือก',
    chokepointsPassed: 'ช่องทางคับแคบที่ผ่าน',
    geopoliticalFactors: 'ปัจจัยด้านภูมิรัฐศาสตร์',
    viewFullAnalysis: 'ดูการวิเคราะห์แบบเต็ม',
    clickToView: 'คลิกที่เส้นทางการค้าหรือช่องทางคับแคบบนแผนที่เพื่อดูข้อมูลรายละเอียด',
    
    tradeRoutes: 'เส้นทางการค้า',
    searchRoutes: 'ค้นหาเส้นทาง...',
    allStatuses: 'ทุกสถานะ',
    active: 'ใช้งาน',
    atRiskStatus: 'เสี่ยง',
    disrupted: 'หยุดชะงัก',
    allRiskLevels: 'ทุกระดับความเสี่ยง',
    low: 'ต่ำ',
    medium: 'ปานกลาง',
    high: 'สูง',
    critical: 'วิกฤต',
    allCommodities: 'ทุกสินค้า',
    route: 'เส้นทาง',
    originDestination: 'ต้นทาง → ปลายทาง',
    showing: 'กำลังแสดง',
    of: 'จาก',
    totalVolume: 'ปริมาณรวม',
    
    intelligenceFeed: 'ฟีดข่าวกรอง',
    risks: 'ความเสี่ยง',
    opportunities: 'โอกาส',
    clearFilters: 'ล้างตัวกรอง',
    copied: 'คัดลอกแล้ว!',
    
    scenarioPlanning: 'การวางแผนสถานการณ์',
    simulateScenarios: 'จำลองสถานการณ์ทางภูมิรัฐศาสตร์และวิเคราะห์ผลกระทบต่อเส้นทางการค้าทั่วโลก',
    activate: 'เปิดใช้งาน',
    deactivateScenario: 'ปิดใช้งานสถานการณ์',
    activateScenario: 'เปิดใช้งานสถานการณ์',
    selectScenario: 'เลือกสถานการณ์',
    chooseScenario: 'เลือกสถานการณ์จากรายการเพื่อดูการวิเคราะห์ผลกระทบรายละเอียดและกลยุทธ์การบรรเทา',
    clearAll: 'ล้างทั้งหมด',
    activeScenarios: 'สถานการณ์ที่ใช้งาน',
    probability: 'ความน่าจะเป็น',
    timeline: 'กรอบเวลา',
    impactAnalysis: 'การวิเคราะห์ผลกระทบ',
    volumeChange: 'การเปลี่ยนแปลงปริมาณ',
    delayIncrease: 'การเพิ่มความล่าช้า',
    costImpact: 'ผลกระทบต่อต้นทุน',
    affectedRoutes: 'เส้นทางที่ได้รับผลกระทบ',
    affectedChokepoints: 'ช่องทางคับแคบที่ได้รับผลกระทบ',
    mitigationStrategies: 'กลยุทธ์การบรรเทา',
    calculationFormulas: 'สูตรการคำนวณ',
    volumeAdjustment: 'การปรับปริมาณ',
    deliveryTimeImpact: 'ผลกระทบต่อเวลาในการจัดส่ง',
    costMultiplier: 'ตัวคูณต้นทุน',
    currencyImpact: 'ผลกระทบของสกุลเงิน',
    riskPremium: 'เบี้ยประกันความเสี่ยง',
    
    exportData: 'ส่งออกข้อมูล',
    chooseFormat: 'เลือกรูปแบบและข้อมูลที่จะส่งออก',
    exportFormat: 'รูปแบบการส่งออก',
    recommended: 'แนะนำ',
    includeData: 'รวมข้อมูล',
    exportSummary: 'สรุปการส่งออก',
    datasetsSelected: 'ชุดข้อมูลที่เลือก',
    exportButton: 'ส่งออกข้อมูล',
    exportedSuccessfully: 'ส่งออกสำเร็จ',
  },
}

export const getTranslation = (lang: Language, key: keyof Translations): string => {
  return translations[lang][key] || translations.en[key]
}

