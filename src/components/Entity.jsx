import React from 'react';

function Entity({ title, health}) {
    return (
        <section className="container">
            <h2>{title}</h2>
            <div className="healthbar">
                <div style={{ width: `${health}%` }} className="healthbar__value"></div>
            </div>
        </section>
    )
}

export default Entity