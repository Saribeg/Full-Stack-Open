import PropTypes from 'prop-types';
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from './';
import { getNestedValueFromObj } from '../../../utils/commonHelpers';

const AutoTable = ({ titles = [], listToRender = [], cellProps = [], getCellContent }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {titles.map((title) => (
            <TableHeaderCell key={title}>{title}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {listToRender.map((item) => (
          <TableRow key={item.id}>
            {cellProps.map((prop) => (
              <TableCell key={`${item.id}-${prop}`}>
                {getCellContent ? getCellContent(item, prop) : getNestedValueFromObj(item, prop)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AutoTable;

AutoTable.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  listToRender: PropTypes.arrayOf(PropTypes.object).isRequired,
  cellProps: PropTypes.arrayOf(PropTypes.string).isRequired,
  getCellContent: PropTypes.func
};
