# Excel 数据格式说明

## 必需列
Excel 文件必须包含以下列（列名不区分大小写）：

1. **Name** (或 City, City Name) - 城市名称
2. **Lat** (或 Latitude) - 纬度
3. **Lng** (或 Longitude, Lon) - 经度

## 可选列
- **Weighted FDI** (或 FDI, weighted_fdi) - 足球发展指数
- 其他任何数据列都会被自动包含在城市信息中

## Excel 文件格式示例

| Name | Lat | Lng | Government spending on football-related development ($) | Investment scale from private or commercial sectors | Registered football players | Youth football participation rate | weighted FDI |
|------|-----|-----|--------------------------------------------------|---------------------------------------------|---------------------------|------------------------------|-------------|
| London | 51.5074 | -0.1278 | 12,722,074 | 117,775,000 | 2,200,000 | 40% | 70.6 |
| Barcelona | 41.3851 | 2.1734 | 30,626,180 | 117,775,000 | 1,063,090 | 35% | 52.6 |

## 使用说明

1. 准备好符合格式的 Excel 文件（.xlsx 或 .xls）
2. 在地图页面点击右上角的 "Upload Excel" 按钮
3. 选择您的 Excel 文件
4. 数据会自动解析并更新地图上的标记点

## 注意事项

- 第一行必须是表头（列名）
- 城市名称、纬度、经度是必需的，缺失这些数据的行会被跳过
- 数值可以包含逗号（如 1,000,000）
- 百分比可以包含 % 符号
- 货币符号会被保留显示

## 错误排查

如果上传失败，请检查：
1. 文件格式是否为 .xlsx 或 .xls
2. 是否包含必需的列名
3. 纬度和经度是否为有效数字
4. 文件是否损坏

动态更新后，地图会立即反映 Excel 文件中的所有数据变化。
