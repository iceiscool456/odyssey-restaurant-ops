import { ScrollView, Text, View } from 'react-native';
import { border, color, fontFamily, fontSize, fontWeight, layout, letterSpacing, space } from '../tokens';

export type TableColumn<T> = {
  key: string;
  header: string;
  flex?: number;
  render: (row: T) => string;
};

export function Table<T extends { id: string }>({
  columns,
  rows,
  emptyLabel = 'No rows',
}: {
  columns: TableColumn<T>[];
  rows: T[];
  emptyLabel?: string;
}) {
  return (
    <ScrollView horizontal style={{ width: '100%' }}>
      <View style={{ minWidth: layout.tableMin, width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: border.hairline,
            borderBottomColor: color.line,
            paddingBottom: space[2],
          }}
        >
          {columns.map((column) => (
            <Text
              key={column.key}
              style={{
                flex: column.flex ?? 1,
                fontFamily: fontFamily.sans,
                fontSize: fontSize.caption,
                fontWeight: fontWeight.semibold,
                color: color.inkMuted,
                textTransform: 'uppercase',
                letterSpacing: letterSpacing.table,
              }}
            >
              {column.header}
            </Text>
          ))}
        </View>
        {rows.length === 0 ? (
          <Text style={{ fontFamily: fontFamily.sans, color: color.inkMuted, paddingVertical: space[4] }}>{emptyLabel}</Text>
        ) : (
          rows.map((row, index) => (
            <View
              key={row.id}
              style={{
                flexDirection: 'row',
                paddingVertical: space[3],
                borderBottomWidth: border.hairline,
                borderBottomColor: color.line,
                backgroundColor: index % 2 === 0 ? color.transparent : color.canvasSubtle,
              }}
            >
              {columns.map((column) => (
                <Text
                  key={column.key}
                  style={{
                    flex: column.flex ?? 1,
                    fontFamily: fontFamily.sans,
                    fontSize: fontSize.body,
                    color: color.ink,
                  }}
                >
                  {column.render(row)}
                </Text>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
