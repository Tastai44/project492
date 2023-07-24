import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { styleTable } from '../../utils/styleBox';
import { IMember } from '../../interface/Group';
import { Button } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex:1 },
  {
    field: 'username',
    headerName: 'Full Name',
    width: 150,
    flex:1
  },
];

interface IData {
  members: IMember[];
}
interface IFunction {
  handleCloseDelete: () => void;
}

export default function DeleteMember(props: IData & IFunction) {
  const rows = props.members.map((row, index) => ({
    id: row.uid,
    number: index+1,
    username: row.username
  }));
  return (
    <Box sx={styleTable}>
        <Box sx={{color: "black", display:"flex", justifyContent:"space-between"}}>
            <h2>Delete Members</h2>
        </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <Box sx={{display:"flex", justifyContent:"flex-end", gap:1, mt:1}}>
        <Button onClick={props.handleCloseDelete}>Cancle</Button>
        <Button>Delete</Button>
      </Box>
    </Box>
  );
}
