import { Nav } from "react-bootstrap";
import path from "../features/router/paths";
import { useHistory, Link } from "react-router-dom";

function NavBar() {
  const history = useHistory();
  const { panchayats, printVoterId, voters, imageGallery, settings } = path.ui;
  return (
    <Nav className="no-print" variant="tabs">
      <Nav.Item>
        <Nav.Link
          onClick={() => history.push(voters)}
          active={voters === history.location.pathname}
        >
          Voters
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={() => history.push(panchayats)}
          active={panchayats === history.location.pathname}
        >
          Panchayats
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link
          onClick={() => history.push(printVoterId)}
          active={printVoterId === history.location.pathname}
        >
          Print Voter Id
        </Nav.Link>
      </Nav.Item>

      {/* <Nav.Item>
        <Nav.Link
          onClick={() => history.push(imageGallery)}
          active={imageGallery === history.location.pathname}
        >
          Image Gallery
        </Nav.Link>
      </Nav.Item> */}

      {/* <Nav.Item>
        <Nav.Link
          onClick={() => history.push(settings)}
          active={settings === history.location.pathname}
        >
          Settings
        </Nav.Link>
      </Nav.Item> */}
    </Nav>
  );
}

export default NavBar;
