import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import path from "./features/router/paths";
import VotersPage from "./pages/Voters.page";
import PanchayatsPage from "./pages/Panchayats.page";

import "./App.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Settings from "./pages/Settings.page";
import PrintVoterIdPage from "./pages/PrintVoterId.page";
import ImageGalleryPage from "./pages/Gallery.page";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path={path.ui.voters}>
            <VotersPage />
          </Route>
          <Route path={path.ui.panchayats}>
            <PanchayatsPage />
          </Route>
          <Route path={path.ui.printVoterId}>
            <PrintVoterIdPage />
          </Route>
          {/* <Route path={path.ui.imageGallery}>
            <ImageGalleryPage />
          </Route>
          <Route path={path.ui.settings}>
            <Settings />
          </Route> */}
          <Route path={path.ui.root}>
            <Redirect to={path.ui.voters} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
