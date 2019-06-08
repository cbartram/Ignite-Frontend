import React, { Component } from 'react';
import withContainer from "../../components/withContainer";
import { API_KEY} from "../../constants";

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state ={
            file:null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e){
        e.preventDefault();// Stop form submit
        this.fileUpload(this.state.file);
    }
    onChange(e) {
        this.setState({file: e.target.files[0]})
    }

    async fileUpload(file){
        const url = 'https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/dev/upload';
        const data = new FormData();
        data.append('file', file);

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                path: '/upload',
                method: 'POST',
                body: {
                    fileName: file.name
                },
            }),
        };

        try {
            console.log('Attempting to upload...');

            const { body } = await (await fetch(url, config)).json();

            console.log('[SIGNED URL RES]', body);

            fetch(body.signedUrl, { method: 'PUT', body: data })
                .then(response => response.text())
                .then(str => console.log(str))
        } catch(err) {
            console.log('[ERROR] Error uploading: ', err);
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <div className="d-flex flex-row justify-content-center">
                        <form onSubmit={this.onFormSubmit}>
                            <h1>File Upload</h1>
                            <input type="file" onChange={this.onChange} />
                            <button className="common-Button common-Button--default" type="submit">Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withContainer(Upload);
