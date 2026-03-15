import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { LineChartItem } from '../../types'

interface SimpleLineChartProps {
  items: LineChartItem[]
  unit?: string
  caption?: string
  color?: string
}

export default function SimpleLineChart({ items, unit, caption, color }: SimpleLineChartProps) {
  const theme = useTheme()
  const lineColor = color || theme.palette.secondary.main

  return (
    <Box sx={{ my: 2 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={items} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}${unit ? ` ${unit}` : ''}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: theme.shadows[2],
                fontSize: 12,
                fontWeight: 600
              }}
              itemStyle={{ color: theme.palette.text.primary }}
              formatter={((value: unknown) => [`${value}${unit ? ` ${unit}` : ''}`, '']) as never}
              labelStyle={{ color: theme.palette.text.secondary, marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
