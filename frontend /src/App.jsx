import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);

  const defaultRows = 3; // Default number of rows
  const defaultCols = 3; // Default number of columns

  // Fetch initial data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cells');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const fetchedData = await response.json();

        // Initialize the table with default structure
        const table = Array.from({ length: defaultRows }, () =>
          Array.from({ length: defaultCols }, () => ({ value: '' }))
        );

        // Populate table with fetched data
        fetchedData.forEach(({ rowId, colId, value }) => {
          if (rowId < defaultRows && colId < defaultCols) {
            table[rowId][colId] = { value };
          }
        });

        setData(table);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleCellChange = async (rowIndex, colIndex, value) => {
    const updatedData = data.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? { value } : cell
      )
    );
    setData(updatedData);

    try {
      const response = await fetch('http://localhost:5000/api/cells', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rowId: rowIndex,
          colId: colIndex,
          value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating cell:', errorData.message);
      }
    } catch (error) {
      console.error('Error connecting to the server:', error.message);
    }
  };

  const addRow = async () => {
    const newRowIndex = data.length;
    const newRow = Array(data[0]?.length || defaultCols).fill({ value: '' });

    try {
      const response = await fetch(`http://localhost:5000/api/cells/row/${newRowIndex}`);
      if (response.ok) {
        const rowData = await response.json();
        rowData.forEach(({ colId, value }) => {
          newRow[colId] = { value };
        });
      }
    } catch (error) {
      console.error('Error fetching row data:', error.message);
    }

    setData([...data, newRow]);
  };

  const addColumn = async () => {
    const newColIndex = (data[0]?.length || 0);
    const newColumn = data.map(() => ({ value: '' }));

    try {
      const response = await fetch(`http://localhost:5000/api/cells/column/${newColIndex}`);
      if (response.ok) {
        const colData = await response.json();
        colData.forEach(({ rowId, value }) => {
          newColumn[rowId] = { value };
        });
      }
    } catch (error) {
      console.error('Error fetching column data:', error.message);
    }

    setData(data.map((row, rowIndex) => [...row, newColumn[rowIndex] || { value: '' }]));
  };

  const deleteRow = async (rowIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cells/${rowIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting row:', errorData.message);
        return;
      }

      setData(data.filter((_, rIndex) => rIndex !== rowIndex));
    } catch (error) {
      console.error('Error connecting to the server:', error.message);
    }
  };

  const deleteColumn = async (colIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cells/column/${colIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting column:', errorData.message);
        return;
      }

      setData(data.map((row) => row.filter((_, cIndex) => cIndex !== colIndex)));
    } catch (error) {
      console.error('Error connecting to the server:', error.message);
    }
  };

  return (
    <div className="App">
      <h1>Spreadsheet App</h1>
      <div className="table-container">
        <table>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      value={cell.value}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => deleteRow(rowIndex)}>Delete Row</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="controls">
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
      </div>
      {data[0]?.length > 0 && (
        <div className="delete-controls">
          {data[0].map((_, colIndex) => (
            <button key={colIndex} onClick={() => deleteColumn(colIndex)}>
              Delete Column {colIndex + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
