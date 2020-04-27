import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-semantic-toasts";
import {
  Dimmer,
  Loader,
  Dropdown,
  Button,
  Icon,
  Modal,
  Grid,
} from "semantic-ui-react";

import {
  getHostelOptions,
  uploadHostelDetails,
} from "../../actions/hostelUploads";

import main from "../../css/subscriber";

const HostelToOptions = (hostels) => {
  var hostelLists = [];
  for (var hostel of hostels) {
    hostelLists.push({
      key: hostel.slug,
      value: hostel.slug,
      text: hostel.name,
    });
  }
  return hostelLists;
};

class HostelUploads extends Component {
  state = {
    hostelSelected: [],
    isModalOpen: false,
  };

  onChangeHostelValue = (e, { value }) => {
    this.setState({ hostelSelected: value });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  onSubmitHostel = () => {
    if (this.state.hostelSelected.length === 0) {
      toast({
        type: "error",
        title: "Hostel Selected cannot be empty",
        animation: "fade up",
        time: 1000,
      });
    } else {
      this.props.uploadHostelDetails(this.state.hostelSelected);
    }
    this.closeModal();
  };

  componentDidMount() {
    this.props.getHostelOptions();
  }

  render() {
    const { hostels } = this.props;
    if (hostels.isFetching) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <div className={main["main-content"]}>
        <div className={main["hostel-upload-form"]}>
          <h3>
            Select all the bhawan you have been resided since the first year
          </h3>
          <div className={main["notif"]}>
            Note: Please select the options carefully, this field is non
            editable once submitted.
          </div>
          <Dropdown
            fluid
            search
            selection
            multiple
            value={this.state.hostelSelected}
            onChange={this.onChangeHostelValue}
            options={HostelToOptions(hostels.residenceOptions)}
          />
          <Modal
            open={this.state.isModalOpen}
            trigger={
              <Button
                size="large"
                color="green"
                onClick={this.openModal}
                className={main["upload-btn"]}
              >
                <Icon name="save" /> Submit and Proceed
              </Button>
            }
          >
            <Modal.Content>
              <h3>Are you sure you want to continue?</h3>
              <Grid centered celled="internally" columns={2}>
                <Grid.Column
                  className={main["cancel-btn"]}
                  verticalAlign="middle"
                  onClick={this.closeModal}
                >
                  Cancel
                </Grid.Column>

                <Grid.Column verticalAlign="middle">
                  <div
                    className={main["continue-btn"]}
                    onClick={this.onSubmitHostel}
                  >
                    Sure Proceed.
                  </div>
                </Grid.Column>
              </Grid>
            </Modal.Content>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hostels: state.getHostelOptions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getHostelOptions: () => {
      dispatch(getHostelOptions());
    },
    uploadHostelDetails: (hostels) => {
      dispatch(uploadHostelDetails(hostels));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HostelUploads);
