import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Select,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  createLoadingAndErrorSelector,
  categorysSelector,
} from '../selectors';
import { getCategorys } from '../actions/categorys';
import { submitPost } from '../actions/post';

class CreatePostPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postType: 'text',
      title: '',
      body: '',
      url: '',
      category: '',
    };
  }

  componentDidMount() {
    const { getCategorys } = this.props;
    getCategorys();
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { postType, title, body, url, category } = this.state;
      const { submitPost, history } = this.props;
      const { id } = await submitPost({
        type: postType,
        title,
        body: postType === 'text' ? body : url,
        category,
      });
      history.push(`/r/${category}/comments/${id}`);
    } catch (err) {}
  };

  render() {
    const { postType, title, body, url, category } = this.state;
    const {
      srIsLoading,
      srError,
      submitIsLoading,
      submitError,
      categorys,
    } = this.props;
    return (
      <Box w={['100%', '90%', '80%', '70%']} m="auto">
        {submitError && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {submitError}
          </Alert>
        )}
        <form onSubmit={this.handleSubmit}>
          <Stack spacing={3}>
            <FormControl>
              <RadioGroup
                value={postType}
                onChange={(postType) => this.setState({ postType })}
              >
                <Stack direction="row" spacing={3}>
                  <Radio value="text">text post</Radio>
                  <Radio value="link">link</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl>
              <Input
                value={title}
                onChange={(e) => this.setState({ title: e.target.value })}
                type="text"
                variant="filled"
                placeholder="title"
                isRequired
              />
            </FormControl>
            <FormControl>
              {postType === 'text' ? (
                <Textarea
                  value={body}
                  onChange={(e) => this.setState({ body: e.target.value })}
                  variant="filled"
                  placeholder="text (optional)"
                  rows={10}
                />
              ) : (
                <Input
                  value={url}
                  onChange={(e) => this.setState({ url: e.target.value })}
                  type="url"
                  variant="filled"
                  placeholder="url"
                  required
                />
              )}
            </FormControl>
            <FormControl isInvalid={srError}>
              <Select
                value={category}
                onChange={(e) => this.setState({ category: e.target.value })}
                variant="filled"
                placeholder={srIsLoading ? 'loading...' : 'choose a category'}
                isRequired
              >
                {categorys.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>Could not load categorys</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              isLoading={srIsLoading || submitIsLoading || null}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    );
  }
}

const {
  loadingSelector: srLoadingSelector,
  errorSelector: srErrorSelector,
} = createLoadingAndErrorSelector(['GET_CATEGORYS']);

const {
  loadingSelector: submitLoadingSelector,
  errorSelector: submitErrorSelector,
} = createLoadingAndErrorSelector(['SUBMIT_POST'], false);

const mapStateToProps = (state) => ({
  srIsLoading: srLoadingSelector(state),
  srError: srErrorSelector(state),
  submitIsLoading: submitLoadingSelector(state),
  submitError: submitErrorSelector(state),
  categorys: categorysSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getCategorys: () => dispatch(getCategorys()),
  submitPost: (postDetails) => dispatch(submitPost(postDetails)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreatePostPage)
);
