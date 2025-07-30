import { useRef, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { BsFillPencilFill } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ROLES } from "../../config/roles";
import { useAuthContext } from "../../context/auth";
import { useUserContext } from "../../context/user";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const validator = require("validator");

const Edit = ({ user }) => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatch } = useUserContext();
  const { auth } = useAuthContext();
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [changeIcon, setChangeIcon] = useState(false);
  const [active, setActive] = useState(user.active);
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const rolesRef = useRef([]);
  const activeRef = useRef("");

  const permitEditRole =
    auth.roles.includes(ROLES.Root) && !user.roles.includes(ROLES.Root);
  const permiEditActive = permitEditRole || user.roles.includes(ROLES.User);

  const handleShowPassword = (e) => {
    e.preventDefault();
    const isPassword = passwordRef.current.type === "password";
    passwordRef.current.type = isPassword ? "text" : "password";
    setChangeIcon(isPassword);
  };

  const handleUpdate = async () => {
    const updateUser = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      roles: rolesRef.current.value,
      active: activeRef.current.checked,
    };
    const prevUser = [user.name, user.email, user.roles[0], user.active];

    Object.keys(updateUser).forEach((key) => {
      const val = updateUser[key];
      if (
        val === undefined ||
        validator.isEmpty(val?.toString() ?? "", { ignore_whitespace: true }) ||
        prevUser.includes(val)
      ) {
        delete updateUser[key];
      }
    });

    if (!auth) {
      setError("You must be logged in");
      return;
    }

    const checkChange = Object.keys(updateUser).length === 0;

    if (!checkChange) {
      updateUser.id = user._id;

      if (updateUser.roles && typeof updateUser.roles === "string") {
        updateUser.roles = [updateUser.roles];
      }

      try {
        const response = await axiosPrivate.patch("/api/users", updateUser);
        dispatch({ type: "UPDATE_USER", payload: response.data });
        setError(null);
        setShow(false);
      } catch (error) {
        rolesRef.current.value = user.roles;
        activeRef.current.checked = user.active;

        const message = error.response?.data?.error || "Update failed";
        if (message.toLowerCase().includes("reuse")) {
          setError("You cannot reuse your last 2 passwords.");
        } else if (message.toLowerCase().includes("expired")) {
          setError("Your password has expired. Please choose a new one.");
        } else {
          setError(message);
        }
      }
    } else {
      setError("Nothing Changed");
    }
  };

  return (
    <>
      <button
        className="p-1 mx-2 text-primary border-0 bg-transparent"
        onClick={() => setShow(!show)}
      >
        <BsFillPencilFill className="fs-4" />
      </button>

      <Modal
        show={show}
        onHide={() => {
          setShow(!show);
          setError(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" defaultValue={user.name} ref={nameRef} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              defaultValue={user.email}
              ref={emailRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password: </Form.Label>
            <div className="d-flex">
              <Form.Control
                type="password"
                ref={passwordRef}
                autoComplete="on"
              />
              <Button
                variant="default"
                className="mb-2"
                onClick={handleShowPassword}
              >
                {changeIcon ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {permitEditRole && (
            <Form.Group className="mb-3">
              <Form.Label>Roles:</Form.Label>
              <select
                className="form-select"
                aria-label="select roles"
                ref={rolesRef}
                defaultValue={user.roles[0]}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </Form.Group>
          )}

          {permiEditActive && (
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Active:</Form.Label>
              <Form.Check
                type="switch"
                ref={activeRef}
                defaultChecked={active}
                onClick={() => setActive(!active)}
              />
            </Form.Group>
          )}

          {error && <Alert variant={"danger"}>{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Edit;
