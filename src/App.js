import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  Form,
  Card,
  CardDeck,
} from "react-bootstrap";
import { sortData, prettyPrintStat } from "./utils/utils";
import InfoBox from "./component/Info-Box/Info-Box.component";
import LineGraph from "./component/Line-Graph/Line-Graph.component";
import Map from "./component/Map/Map.component";
import indiaState from "./assets/indiaState.json";
import Table from "./component/Table/Table.component";
import logoWhite from "./assets/Logo-White.svg";
import logoBlack from "./assets/Logo-Black.svg";
import sun from "./assets/sun.svg";
import moon from "./assets/moon.svg";
import "./App.css";

function App() {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") === null
      ? "light"
      : localStorage.getItem("theme")
  );
  const [currentDetail, setCurrentDetail] = useState(
    localStorage.getItem("currentDetail") === null
      ? "india"
      : localStorage.getItem("currentDetail")
  );
  const [countries, setCountries] = useState([]);
  // const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [mapZoom, setMapZoom] = useState(currentDetail === "india" ? 4.5 : 3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [mode]);

  const hangleToggleButton = (e) => {
    let currentToggleButton = e === 1 ? "india" : "worldwild";
    setCurrentDetail(currentToggleButton);
    localStorage.setItem("currentDetail", currentToggleButton);
  };

  useEffect(() => {
    const countryData = () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        });
    };

    const stateData = () => {
      fetch("https://disease.sh/v3/covid-19/gov/india")
        .then((response) => response.json())
        .then(({ total }) => {
          setCountryInfo(total);
        });
    };

    currentDetail === "india" ? stateData() : countryData();
  }, [currentDetail]);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const countryData = data.map((country) => ({
            country: country.country,
            cases: country.cases,
            recovered: country.recovered,
            deaths: country.deaths,
            divider: 1,
            countryInfo: {
              flag: country.countryInfo.flag,
              lat: country.countryInfo.lat,
              long: country.countryInfo.long,
            },
          }));

          let sortedData = sortData(data);
          setCountries(countries);

          setMapCountries(countryData);
          setTableData(sortedData);
        });
    };

    const getStateData = async () => {
      fetch("https://disease.sh/v3/covid-19/gov/india")
        .then((response) => response.json())
        .then(({ states }) => {
          const statesName = states.map((state) => ({
            name: state.state,
            value: state.state,
            country: state.state,
            cases: state.cases,
            recovered: state.recovered,
            deaths: state.deaths,
            divider: 2,
            countryInfo: {
              flag: null,
              lat: null,
              long: null,
            },
          }));

          statesName.forEach((state) => {
            indiaState.map((e) => {
              if (e.name === state.name) {
                state.countryInfo.lat = e.Latitude;
                state.countryInfo.long = e.Longitude;
              }
              return e;
            });
          });

          // console.log(statesName);
          let sortedData = sortData(statesName);

          // console.log(states);
          setMapCountries(statesName);
          setCountries(statesName);
          setTableData(sortedData);
        });
    };

    currentDetail === "india" ? getStateData() : getCountriesData();
  }, [currentDetail]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    if (currentDetail === "india") {
      fetch("https://disease.sh/v3/covid-19/gov/india")
        .then((response) => response.json())
        .then(({ total, states }) => {
          if (countryCode === "india") {
            setCountryInfo(total);
            setMapCenter({ lat: 28.6139, lng: 77.209 });
            setMapZoom(4.5);
          } else {
            states.map((state) =>
              state.state === countryCode ? setCountryInfo(state) : null
            );

            indiaState.map((state) => {
              if (state.name === countryCode) {
                setMapCenter([state.Latitude, state.Longitude]);
                setMapZoom(6);
              }
              return state;
            });
          }
        });
    } else {
      const url =
        countryCode === "worldwide"
          ? "https://disease.sh/v3/covid-19/all"
          : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // setCountry(countryCode);
          // All of the data from the country
          setCountryInfo(data);

          countryCode !== "worldwide"
            ? setMapCenter([data.countryInfo.lat, data.countryInfo.long])
            : setMapCenter({ lat: 28.6139, lng: 77.209 });
          setMapZoom(4);
        });
    }
  };

  useEffect(() => {
    if (currentDetail === "india") {
      setMapCenter({ lat: 28.6139, lng: 77.209 });
      setMapZoom(4.5);
    } else {
      setMapCenter({ lat: 28.6139, lng: 77.209 });
      setMapZoom(3);
    }
  }, [currentDetail]);

  return (
    <div className='app'>
      {/* Nav Bar */}
      {/* Logo + Dark/Light Mode */}
      <Navbar className='justify-content-between'>
        <Navbar.Brand>
          <img
            src={mode === "light" ? logoWhite : logoBlack}
            className='d-inline-block align-top navbar__logo'
            alt='Logo'
          />
        </Navbar.Brand>

        <div
          onClick={() =>
            mode === "light" ? setMode("dark") : setMode("light")
          }
          className='toggle h-100 d-flex justify-content-center align-items-center'>
          <div className='toggle__text'>
            {mode === "light" ? "Light Mode" : "Dark Mode"}
          </div>
          <img
            src={mode === "light" ? sun : moon}
            alt='Icon'
            className='toggle__icon pl-2'
          />
        </div>
      </Navbar>

      <Container fluid className='pt-4'>
        <Row>
          <Col lg={8} className='mb-5 mb-lg-0'>
            {/* Two Select Input Dropdrown field */}
            <div className='d-flex align-items-center flex-md-row flex-column justify-content-center justify-content-md-between pt-3 pb-3'>
              <ToggleButtonGroup
                type='radio'
                name='option'
                defaultValue={currentDetail === "india" ? 1 : 2}
                onChange={hangleToggleButton}
                className='mb-2 mb-md-0'>
                <ToggleButton
                  variant={
                    mode === "light" ? "outline-danger" : "outline-primary"
                  }
                  className='myBtn'
                  value={1}>
                  India
                </ToggleButton>
                <ToggleButton
                  variant={
                    mode === "light" ? "outline-danger" : "outline-primary"
                  }
                  className='myBtn'
                  value={2}>
                  WorldWild
                </ToggleButton>
              </ToggleButtonGroup>

              {/* DropDown */}
              <Form>
                <Form.Control
                  className='my-dropdown formWith'
                  as='select'
                  size='lg'
                  onChange={onCountryChange}
                  custom>
                  <option
                    key={currentDetail === "india" ? "ind" : "world"}
                    value={currentDetail === "india" ? "india" : "worldwide"}>
                    {currentDetail === "india" ? "India" : "WorldWide"}
                  </option>

                  {countries.map((country) => (
                    <option
                      key={country.id == null ? country.name : country.id}
                      value={
                        country.value == null ? country.name : country.value
                      }>
                      {country.name}
                    </option>
                  ))}
                </Form.Control>
              </Form>
            </div>

            {/* 3 InfoBox */}
            <CardDeck className='app__stats mt-3'>
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title='Coronavirus Cases'
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={prettyPrintStat(countryInfo.cases)}
              />
              <InfoBox
                active={casesType === "recovered"}
                onClick={(e) => setCasesType("recovered")}
                title='Recovered'
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={prettyPrintStat(countryInfo.recovered)}
              />
              <InfoBox
                isRed
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")}
                title='Deaths'
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={prettyPrintStat(countryInfo.deaths)}
              />
            </CardDeck>
            {/* Map */}
            <Map
              caseTypes={casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
            />
          </Col>
          <Col lg={4}>
            {/* Table */}
            <Card className='d-md-flex d-lg-block flex-md-row myCard'>
              <Card.Body className='mr-md-3 mr-0 mr-sm-0 mr-lg-0'>
                <Card.Title className='myCard__tittle additionlFont'>
                  {`Live Cases by ${
                    currentDetail === "india" ? "Sates" : "Countires"
                  }`}
                </Card.Title>
                <Table countries={tableData} currentDetail={currentDetail} />
              </Card.Body>
              <Card.Body className='myMedia'>
                <Card.Title className='myCard__tittle additionlFont'>
                  {`${
                    currentDetail === "india" ? "Sates Wise" : "WorldWide"
                  } New ${casesType}`}
                </Card.Title>
                <LineGraph
                  casesType={casesType}
                  mode={mode}
                  currentDetail={currentDetail}
                />
              </Card.Body>
            </Card>
            {/* Graph */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default App;
