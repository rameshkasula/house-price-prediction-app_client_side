import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function App() {
  const [location, setLocation] = React.useState("");
  // check this
  const [price, setPrice] = React.useState();

  const [locationsList, setLocationsList] = React.useState([]);
  const [sqFt, setSqFt] = React.useState();

  const [bhk, setBhk] = React.useState();
  const [bath, setBath] = React.useState();

  const handleChange = (event) => {
    const { value } = event.target;
    setLocation(value);
  };

  React.useEffect(() => {
    axios
      .get("https://house-price-prediction-api-chi.vercel.app/get_location_names")
      .then((res) => {
        setLocationsList(res.data.locations);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const predictPrice = () => {
    //  console.log("love");

    const payload = {
      location: location,
      total_sqft: sqFt,
      bhk: bhk,
      bath: bath,
    };

    axios
      .post(
        "https://house-price-prediction-api-chi.vercel.app/predict_home_price",
        payload
      )
      .then((res) => {
        console.log(res.data);
        setPrice(res.data?.estimated_price);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Typography gutterBottom component={"h4"} variant={"h4"} align={"center"}>
        House Price Predictor
      </Typography>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        margin={5}
      >
        <Item>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Location</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={location}
              label="Age"
              onChange={handleChange}
            >
              {locationsList?.length > 0 &&
                locationsList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Item>
        <Item>
          <TextField
            type={"number"}
            label="Area (sq.ft)"
            value={sqFt}
            onChange={(e) => setSqFt(Number(e.target.value))}
          />
        </Item>
        <Item>
          <TextField
            type={"number"}
            label={"BHK"}
            value={bhk}
            onChange={(e) => setBhk(Number(e.target.value))}
          />
        </Item>
        <Item>
          <TextField
            type={"number"}
            label={"Bath"}
            value={bath}
            onChange={(e) => setBath(Number(e.target.value))}
          />
        </Item>
        <Item>
          <Button variant="contained" onClick={predictPrice}>
            Predict Price
          </Button>
        </Item>
      </Stack>
      {price && (
        <Typography
          gutterBottom
          component={"h3"}
          variant={"h3"}
          align={"center"}
        >
          Total Price : {price} in Lakhs
        </Typography>
      )}
    </div>
  );
}
