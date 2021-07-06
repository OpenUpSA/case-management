import i18next from "i18next";
import Layout from "../components/layout";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Button } from "@material-ui/core";
import { Fab } from "@material-ui/core";
import { PersonAddTwoTone } from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function Page() {
  return (
    <Layout>
      <Grid
        /*        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"*/
        style={{ marginTop: "100px" }}
      >
        <Grid item>
          <Typography component="h1" variant="h5" style={{ flex: 1 }}>
            {i18next.t("Clients")}
          </Typography>
        </Grid>
        <Grid item>
          <Link href="#">
            <Button>
              <MoreVertIcon />
            </Button>
          </Link>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      <Fab variant="extended" color="primary" className="fab">
        <PersonAddTwoTone />
        {i18next.t("New client")}
      </Fab>
    </Layout>
  );
}
