import React from 'react';

const Result = ({result}) => {
    if(!result) return ''
    return <div>
        <div>
        <table>
                <tr>
                  <th>ID</th>
                  <th>Event Name</th>
                  <th>Date</th>
                </tr>
            {result.map((event) => 
            (
                <tr>
                  <td>{event.id}</td>
                  <td>{event.eventname}</td>
                  <td>{new Date(event.date).toLocaleString()}</td>
                </tr>
            ))};
           
        </table>
        </div>
    </div>;
}

const Search = (props) => {
    const {
        searchQuery,
        onChange,
        search
    } = props;

    return <div>
        <input
            type="text"
            value={searchQuery}
            onChange={onChange}
        />
        <button onClick={search}>Search</button>
    </div>;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            result: ''
        }

        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    onSearchQueryChange(e) {
        this.setState({searchQuery: e.target.value});
    }

    onSearch() {
        console.log('in Search', this.state.searchQuery);
        fetch('http://localhost:8080/whattodo/events?eventcode=LIVE&radius=1')
            .then(response => {
                if (!response.ok) {
                    console.log('Response Status', response.status);
                    throw Error("Failed connection to the API");
                }
                return response
            })
            .then(response => response.json())
            .then(response => {
                console.log('Response', response);
                this.setState({
                    result: response
                })
            }, () => {
                this.setState({
                    requestFailed: true
                })
            })
    }

    render() {
        const {result, searchQuery} = this.state;

        return <div>
            <Search
                searchQuery={searchQuery}
                onChange={this.onSearchQueryChange}
                search={this.onSearch}
            />
            <Result result={result} />
        </div>;
    }
}
export default App;

