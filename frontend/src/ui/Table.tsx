import React from 'react';
import {
  Table as CTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableProps as CTableProps,
} from '@chakra-ui/react';

export type TableProps = CTableProps & { headers?: string[] };

export function SimpleTable({ headers, children, ...props }: React.PropsWithChildren<TableProps>) {
  return (
    <TableContainer>
      <CTable size={props.size ?? 'sm'} variant={props.variant ?? 'simple'} {...props}>
        {headers ? (
          <Thead>
            <Tr>
              {headers.map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </Tr>
          </Thead>
        ) : null}
        <Tbody>{children}</Tbody>
      </CTable>
    </TableContainer>
  );
}

export { Thead, Tbody, Tr, Th, Td };

