import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Spinner from "../Spinner/Spinner";

import {mapExpressionToEmoji, mapExpressionGenderToEmoji, emotions} from "../../utils/emojis";

import "./Results.css";

const Results = ({results, processing}) => {


  if (processing && results) {
    return
          <div>

          </div>
      ;
  }
  if (!processing && results && results.length > 0) {
    return (
      <div className="results">
        {results.length > 1 ? (
          <div>
            <p>I think...</p>
            {results.map((result, i) => (
              <div className="results__wrapper" key={i}>

              </div>
            ))}
          </div>
        ) : (
          <div className="results__wrapper">
            <div className="results__emoji">
            <p>
                You look{" "}
                {results[0].expressions.asSortedArray()[0].expression}
              </p>
              <FontAwesomeIcon
                icon={mapExpressionToEmoji(
                  results[0].expressions.asSortedArray()[0].expression
                )}
                size="4x"
              />
              <FontAwesomeIcon
                icon={mapExpressionGenderToEmoji(
                  results[0].gender
                )}
                size="4x"
              />

            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="results">
        <Spinner />
      </div>
    );
  }
};

export default Results;
