import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { BarChartItem } from '../../types'

interface SimpleBarChartProps {
  items: BarChartItem[]
  unit?: string
  caption?: string
}

export default function SimpleBarChart({ items, unit, caption }: SimpleBarChartProps) {
  const theme = useTheme()

  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ width: '100%', height: Math.max(180, items.length * 36) }}>
        <ResponsiveContainer>
          <BarChart data={items} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={60}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {items.map((item, i) => (
                <Cell
                  key={i}
                  fill={
                    item.highlight
                      ? theme.palette.secondary.main
                      : theme.palette.primary.light
                  }
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={((v: unknown) => `${Number(v).toLocaleString('de-DE')}${unit ? ` ${unit}` : ''}`) as never}
                style={{ fontSize: 11, fontWeight: 600, fill: theme.palette.text.primary }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
