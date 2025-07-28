import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import PersistLoginAlert from "./PersistLoginAlert";
import PersistLoginCheckbox from "./PersistLoginCheckbox";

const SignInWithGoogleButton = ({ persist, setPersist }) => {
  const [show, setShow] = useState(false);

  const handleLogin = () =>
    (window.location.href = `${process.env.REACT_APP_SERVER_URL}/api/auth/google?persist=${persist}`);

  return (
    <>
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-100 transition"
        onClick={() => setShow(!show)}
      >
        <FcGoogle size={20} />
        Sign in with Google
      </button>

      <Modal show={show} onHide={() => setShow(!show)} centered>
        <Modal.Body>
          <PersistLoginCheckbox
            persist={persist}
            setPersist={setPersist}
            className="mt-2 mb-3"
            bold
          />
          <PersistLoginAlert maxWidth="467px" marginAuto={false} />
          <Button className="float-end" variant="primary" onClick={handleLogin}>
            CONTINUE
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignInWithGoogleButton;
