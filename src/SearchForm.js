import React, { Component } from 'react'



const Result = ({ result, keys }) => {
  if (!result) return ''
  return (
    <div>
      {keys.map((key) => {
        return (
          <div>
            <h3>Name: {key}</h3>

            { result.get(key).map((eve) => {
              return (
                <div border='1'>
                  <h6>{eve.description}</h6>
                  <h6>Date: {eve.date}</h6>
                  <Details res={eve} />
                </div>
              );
            })}

            <hr />
          </div>
        );
      })}
    </div>
  );
}

const Details = ({ res }) => {
  if (!res) return ''
  return (
    <div>
      <table>
      <thead>
          <h7>Event Details</h7>      
      </thead>
      <tbody>
        <tr>
        <img src={res.imageurl} />
        </tr>
        <tr>
          <h8>Venue</h8>
          <p>Name: {res.venue.name}</p>
          <p>Address: {res.venue.address}</p>
          <p>Postcode: {res.venue.postcode}</p>
          <p>Phone: {res.venue.phone}</p>
        </tr>
      </tbody>
      </table>
      </div>
  );
}


class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = { eventType: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // Form submitting logic, prevent default page refresh 
  handleSubmit(event) {
    let { city, eventType } = this.state

    if(!city){
      console.log('city is empty', city)
      city = 'latitude=51.5074&longitude=-0.1278'
    }

    if(!eventType){
      eventType = 'LIVE'
      console.log('eventType is empty', eventType)
    }

    fetch('https://www.skiddle.com/api/v1/events/search/?api_key='+city+'&radius=5&eventcode='+eventType+'&order=distance&description=1')
      .then(response => {
        if (!response.ok) {
          console.log('Response Status', response.status);
          throw Error("Failed connection to the API");
        }
        return response
      })
      .then(response => response.json())
      .then(response => {
        let map = this.groupBy(response.results, 'eventname');
        let mapKeys = new Array();
        for (const [key, value] of map) {
          console.log(key + ' = ' + value.date)
          mapKeys.push(key)
        }
        console.log('mapKeys', mapKeys)
        this.setState({
          result: map,
          keys: mapKeys
        })
      }, () => {
        this.setState({
          requestFailed: true
        })
      })

    event.preventDefault()
  }

  // Method causes to store all the values of the 
  // input field in react state single method handle 
  // input changes of all the input field using ES6 
  // javascript feature computed property names
  handleChange(event) {
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name]: event.target.value
    })
  }

  // Return a controlled form i.e. values of the 
  // input field not stored in DOM values are exist 
  // in react component itself as state
  render() {
    const { city, eventType, result, keys } = this.state;
    return (
     <div>
        <form onSubmit={this.handleSubmit}>
        <div>
            <label htmlFor='city'>City</label>
            <select defaultValue="" name='city' placeholder='city' value={this.state.city} onChange={this.handleChange}>
              <option value="">Please Select the City</option>
              <option value="latitude=51.5074&longitude=-0.1278">London</option>
              <option value="latitude=53.409211&longitude=-2.961187">Liverpool</option>
              <option value="latitude=52.482674&longitude=-1.889134">Birmingham</option>
              <option value="latitude=53.474835&longitude=-2.237662">Manchester</option>
            </select>
          </div>
          <div>
            <label htmlFor='eventType'>Event Type</label>
            <select defaultValue="" name='eventType' placeholder='eventType' value={this.state.eventType} onChange={this.handleChange}>
              <option value="">Please select the event Type</option>
              <option value="FEST">Fest</option>
              <option value="LIVE">Live</option>
              <option value="BARPUB">Bar/Pub Events</option>
              <option value="ARTS">Arts</option>
            </select>
          </div>
          <div>
            <button>Search Events</button>
          </div>
        </form>
        <Result result={result} keys={keys} />
      </div>

    )
  }

  groupBy(xs, prop) {
    var grouped = new Map();
    for (var i = 0; i < xs.length; i++) {
      var p = xs[i][prop];
      if (!grouped.get(p)) {
        let array = [];
        array.push(xs[i])
        grouped.set(p, array)
      } else {
        grouped.get(p).push(xs[i]);
      }
    }
    return grouped;
  }

}

export default SearchForm;