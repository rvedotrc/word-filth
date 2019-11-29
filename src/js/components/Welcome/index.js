import React, { Component } from "react";

class Welcome extends Component {
    render() {
        return (
            <div id="Welcome" className={'message'}>
                <h2>Velkommen til</h2>
                <h1>Word Filth</h1>

                <p>
                    Word Filth hjælper dig med at blive godt til dansk,
                    med periodisk gentagelse. Listen indholder flere end
                    300 verber.
                </p>
                <p>
                    Word Filth bruger "Log på med Google", så dine resultater
                    kan gemmes online. Man kan altid downloade ens egen data.
                </p>
                <p>
                    I fremtiden skal Word Filth tillade man, at tilføje
                    ens egen ordforråd.
                </p>
            </div>
        )
    }
}

export default Welcome;
