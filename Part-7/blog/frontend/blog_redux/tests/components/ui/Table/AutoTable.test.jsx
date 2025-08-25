import { render, screen } from '@testing-library/react';
import AutoTable from '../../../../src/components/ui/Table/AutoTable';

describe('AutoTable', () => {
  const titles = ['Name', 'Age'];
  const listToRender = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
  ];
  const cellProps = ['name', 'age'];

  it('renders table headers', () => {
    render(<AutoTable titles={titles} listToRender={listToRender} cellProps={cellProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders rows based on listToRender', () => {
    render(<AutoTable titles={titles} listToRender={listToRender} cellProps={cellProps} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('uses getCellContent when provided', () => {
    const getCellContent = vi.fn((item, prop) => `${prop.toUpperCase()}:${item[prop]}`);
    render(
      <AutoTable
        titles={titles}
        listToRender={listToRender}
        cellProps={cellProps}
        getCellContent={getCellContent}
      />
    );
    expect(screen.getByText('NAME:Alice')).toBeInTheDocument();
    expect(screen.getByText('AGE:25')).toBeInTheDocument();
    expect(getCellContent).toHaveBeenCalledWith(listToRender[0], 'name');
    expect(getCellContent).toHaveBeenCalledWith(listToRender[0], 'age');
  });

  it('renders nested values when no getCellContent provided', () => {
    const data = [{ id: '1', name: 'Alice', age: 30, blogs: [{}, {}] }];

    render(
      <AutoTable
        titles={['Name', 'Blogs Created']}
        listToRender={data}
        cellProps={['name', 'blogs.length']}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
