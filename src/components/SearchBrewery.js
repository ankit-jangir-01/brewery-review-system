import React, { useContext, useEffect, useState } from 'react'
import authContext from '../contexts/auth/authContext'
import { useHistory } from 'react-router-dom'
import { TextField, Button, Card } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const SearchBrewery = () => {

  const types = ["micro", "nano", "regional", "brewpub", "large", "planning", "bar", "contract", "proprietor", "closed"]

  const context = useContext(authContext)
  const history = useHistory();

  const [names, setNames] = useState([]);
  const [cities, setCities] = useState([])
  const [name, setName] = useState("")
  const [city, setCity] = useState("");
  const [type, setType] = useState("")
  const [breweries, setBreweries] = useState([])

  useEffect(() => {
    const checkAuth = async () => {
      (!context.isLoggedIn) && history.push('/auth')
    };
    checkAuth();
  }, [context.isLoggedIn, history]);


  useEffect(() => {
    const fetchBreweries = async() => {
      const res = await fetch(`v1/breweries`)
      const data = await res.json()
      setBreweries(data)
    }
    fetchBreweries()
  }, [])


  const onNameChange = async (value) => {
    setName(value)
    const res = await fetch(`/v1/breweries/search?query={${value}}`)
    const data = await res.json();
    setNames(data)
  }

  const onCityChange = async (value) => {
    setCity(value)
    const res = await fetch(`/v1/breweries?by_city=${value}`)
    const data = await res.json();
    setCities(data)
  }

  const onTypeChange = async (value) => {
    setType(value)
  }



  const handleSearch = async (flag) => {
    let res;
    switch(flag){
      case "name":
        res = await fetch(`/v1/breweries?by_name=${name}`)
        break;
      case "city":
        res = await fetch(`/v1/breweries?by_city=${city}`)
        break;
      case "type":
        res = await fetch(`/v1/breweries?by_type=${type}`)
        break;
    }

    const data = await res.json()
    setBreweries(data)
  }



  return (
    <div style={{ width: '70%', padding: '20px', margin: '20px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', margin: 'auto' }}>
      <div style={{display: 'flex'}}>
        {/* <Button onClick={() => console.log(breweries)}>show breweries</Button> */}
        <Autocomplete
          freeSolo
          options={names?.map((option) => option.name)}
          onChange={(e, value) => setName(value)}
          renderInput={(params) => (
            <TextField {...params} label="Search by name" margin="normal" variant="outlined"
              onChange={(e) => onNameChange(e.target.value)}
              value={name}
            />
          )}
          style={{ minWidth: '400px' }}
        />
        <Button onClick={() => handleSearch("name")}>
          Search
        </Button>
      </div>
      <div style={{display: 'flex'}}>
        <Autocomplete
          freeSolo
          options={cities?.map((option) => option.city)}
          onChange={(e, value) => setCity(value)}
          renderInput={(params) => (
            <TextField {...params} label="enter city" margin="normal" variant="outlined"
              onChange={(e) => onCityChange(e.target.value)}
              value={city}
            />
          )}
          style={{ minWidth: '400px' }}
        />
        <Button onClick={() => handleSearch("city")}>
          Search
        </Button>
      </div>
      <div style={{display: 'flex'}}>
        <Autocomplete
          options={types.map((option) => option)}
          onChange={(e, value) => onTypeChange(value)}
          value={type}
          renderInput={(params) => (
            <TextField {...params} label="Search by brewery type" margin="normal" variant="outlined" />
          )}
          style={{ minWidth: '400px' }}
        />
        <Button onClick={() => handleSearch("type")}>
          Search
        </Button>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
          {
            breweries?.map((item) => {
              return(
                <Card 
                key={item.id}
                style={{margin: '4px', padding: '10px', borderRadius: '12px', backgroundColor: "#f5e1ff", cursor: 'pointer'}}
                onClick={() => history.push(`/brewery/${item.id}`)}
                >
                  <p style={{fontWeight: 'bold'}}>{item.name}</p>
                  <p>{`${item.address_1}, ${item.address_2}, ${item.address_3}`}</p>
                  <p>{`${item.city}, ${item.state_province}, ${item.country} - ${item.postal_code}`}</p>
                  <p>{`Phone: ${item.phone}`}</p>
                  <p>Website: <a href={item.website_url} target='_blank'>{item.website_url}</a></p>
                </Card>
              )
            })
          }  
      </div>

    </div>
  )
}

export default SearchBrewery