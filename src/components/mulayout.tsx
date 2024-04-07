import theme from "../utils/theme";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Snackbar,
  SvgIconTypeMap,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as icons from "@mui/icons-material";
import { APP_NAME } from "../utils/constants";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { IModal, updateModal } from "../redux/slicePage";
import MuTakoz from "./mutakoz";

const iconsMap = {
  Info: icons.Info,
  Save: icons.Save,
  Add: icons.AddCircle,
  List: icons.FormatListBulleted,
  Delete: icons.Delete,
  ImportExport: icons.ImportExport,
} as Record<string, OverridableComponent<SvgIconTypeMap<{}, "svg">>>;

export interface INavItem {
  icon: string;
  link?: string;
  func?: () => void;
}

export interface INotifyingState {
  notificationMessage: string;
  notificationIsoDt: string;
}

export default function MuLayout() {
  const [notify, setNotify] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(
    undefined as string | undefined
  );
  const location = useLocation();
  const pageState = useSelector((state: RootState) => state.page);
  const dispatch = useDispatch();

  /* eslint-disable */
  const notifications = [] as INotifyingState[];
  /* eslint-enable */

  useEffect(() => {
    document.title = pageState.title;
  }, [pageState]);

  useEffect(() => {
    setNotify(false);
    const lNotifications = [...notifications];
    const latestNotification = lNotifications.sort((a, b) =>
      a.notificationIsoDt > b.notificationIsoDt ? 1 : -1
    )[0];
    const now = new Date();
    if (
      latestNotification &&
      now.getTime() - new Date(latestNotification.notificationIsoDt).getTime() <
        5000
    ) {
      setNotify(false);
      setNotificationMessage(latestNotification.notificationMessage);
      setNotify(true);
    }
  }, [notifications]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar sx={{ boxShadow: 0, bgcolor: "#fff", color: "#000" }}>
        <Container maxWidth="sm">
          {pageState?.modal && (
            <Modal
              open={pageState.modal.show}
              onClose={() => {
                dispatch(updateModal({ show: false } as IModal));
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Container maxWidth="sm">
                <div className="mt-12 bg-white py-10 px-5 w-full">
                  <div className="text-lg font-bold">
                    {pageState.modal.title}
                  </div>
                  <MuTakoz />
                  <div>{pageState.modal.text}</div>
                  <MuTakoz />
                  <div className="flex justify-end">
                    {pageState.modal.buttons &&
                      pageState.modal.buttons.map((e, ix) => (
                        <Button
                          key={`modal_button_${ix}`}
                          variant="outlined"
                          onClick={e.func}
                        >
                          {e.label}
                        </Button>
                      ))}
                  </div>
                </div>
              </Container>
            </Modal>
          )}

          <Toolbar disableGutters>
            <Link className="grow" to={"./"}>
              <Typography
                className="underline decoration-4 decoration-yellow-300"
                variant="h4"
                fontWeight="bold"
              >
                {APP_NAME}.
              </Typography>
            </Link>
            <Box>
              {pageState.navItems.map((item: INavItem, ix: number) => {
                const IconClass = iconsMap[item.icon] || icons.QuestionMark;
                if (item.link) {
                  return (
                    <Link key={`nav_button_${ix}`} to={item.link}>
                      <IconButton>
                        <IconClass className="text-black" />
                      </IconButton>
                    </Link>
                  );
                } else if (item.func) {
                  return (
                    <IconButton key={`nav_button_${ix}`} onClick={item.func}>
                      <IconClass className="text-black" />
                    </IconButton>
                  );
                } else {
                  return <></>;
                }
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" className="min-h-screen pt-20">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          variants={{
            initial: {
              opacity: 0,
            },
            in: {
              opacity: 1,
            },
            out: {
              opacity: 0,
            },
          }}
          transition={{
            type: "tween",
            ease: "linear",
            duration: 0.3,
          }}
        >
          <Outlet />
        </motion.div>
        <Snackbar
          className="mb-10"
          open={notify}
          autoHideDuration={6000}
          onClose={() => {
            setNotify(false);
          }}
          message={notificationMessage}
        />
      </Container>
    </ThemeProvider>
  );
}
