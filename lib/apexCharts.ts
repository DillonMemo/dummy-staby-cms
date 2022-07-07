export const tooltip = (color = '#00E396'): ApexTooltip => ({
  marker: { fillColors: [color] },
  x: { show: false },
})

export const stroke = (color = '#00E396'): ApexStroke => ({
  colors: [color],
  width: 2,
  curve: 'smooth',
})

export const markers = (color = '#00E396'): ApexMarkers => ({
  size: 2,
  colors: [color],
  strokeColors: [color],
  strokeWidth: 2,
  hover: {
    sizeOffset: 2,
  },
  // discrete: [
  //   {
  //     seriesIndex: 0,
  //     dataPointIndex: 5,
  //     fillColor: '#ffffff',
  //     strokeColor: color,
  //     size: 5,
  //     shape: 'circle',
  //   },
  // ],
})
