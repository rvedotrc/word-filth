import React, { Component } from "react";

class Welcome extends Component {
    render() {
        return (
            <div id="message">
                <h2>Velkommen til</h2>
                <h1>Word Filth</h1>

                <p>
                    Word Filth hjælper dig med at blive godt til dansk,
                    med periodisk gentagelse af dit vælgte ordforråd.
                    Tilføj simpelthen ord, som du har støddet på,
                    så spørger Word Filth dig senere,
                    for at hjælpe dig at huske dem!
                </p>
            </div>
        )
    }
}

export default Welcome;
