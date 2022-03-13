import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Alert,
  AlertIcon,
  CircularProgress,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import ThemedBox from './ThemedBox';
import {
  userSelector,
  categorysSelector,
  createLoadingAndErrorSelector,
} from '../selectors';
import { startLogout } from '../actions/auth';
import { getCategorys } from '../actions/categorys';
import LoginAndRegisterButtons from './LoginAndRegisterButtons';

const Navbar = ({
  user,
  categorys,
  isLoading,
  error,
  startLogout,
  getCategorys,
}) => {
  const location = useLocation();
  const categoryName = location.pathname.match(/r\/[^\/]+/);

  useEffect(() => {
    getCategorys();
  }, []);

  return (
    <ThemedBox
      py={2}
      px={[0, 0, 10, 10]}
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      mb={7}
    >
      <Heading
        ml={[2, 4]}
        display={user ? 'block' : ['none', 'block']}
        fontSize={['1.3rem', '2.25rem']}
      >
        CrazyStory
      </Heading>
      <HStack>
        <Menu>
          <MenuButton mx={2} as={Button} rightIcon={<ChevronDownIcon />}>
            {categoryName || 'Home'}
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/">
              Home
            </MenuItem>
            <MenuDivider />
            {categorys.map(({ name }) => (
              <MenuItem
                key={name}
                as={Link}
                to={`/r/${name}`}
              >{`r/${name}`}</MenuItem>
            ))}
            {error && (
              <Alert status="error">
                <AlertIcon />
                Error fetching categorys
              </Alert>
            )}
            {isLoading && (
              <Flex justifyContent="center">
                <CircularProgress isIndeterminate />
              </Flex>
            )}
          </MenuList>
        </Menu>
        {user && (
          <Button display={['none', 'flex']} as={Link} to="/submit">
            Submit
          </Button>
        )}
      </HStack>
      <Spacer />

      {user ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {user.username}
          </MenuButton>
          <MenuList>
            <MenuItem display={['block', 'none']} as={Link} to="/submit">
              Submit post
            </MenuItem>
            <MenuItem as={Link} to="/categorys/create">
              Create category
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await startLogout();
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <LoginAndRegisterButtons />
      )}
      <ColorModeSwitcher />
    </ThemedBox>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector([
  'GET_CATEGORYS',
]);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
  categorys: categorysSelector(state),
  user: userSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout()),
  getCategorys: () => dispatch(getCategorys()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
