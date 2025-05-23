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
import { getPermissionList } from "../../actions/getPermissions";

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

const MessOptions = (messes) => {
  var messLists = [];
  for (var mess of messes) {
    messLists.push({
      key: mess.slug,
      value: mess.slug,
      text: mess.name,
    });
  }
  return messLists;
};

class HostelUploads extends Component {
  state = {
    hostelSelected: [],
    messSelected: "",
    isModalOpen: false,
  };

  onChangeHostelValue = (e, { value }) => {
    this.setState({ hostelSelected: value });
  };

  onChangeMessValue = (e, { value }) => {
    this.setState({ messSelected: value });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  onSubmitHostel = () => {
    const { permissions } = this.props;
    const hostelList = permissions.data.results.map(item =>item.authority.slug);

    if (this.state.hostelSelected.length + hostelList.length === 0) {
      toast({
        type: "error",
        title: "Hostel Selected cannot be empty",
        animation: "fade up",
        time: 1000,
      });
    } else {
      let hostelSelected = this.state.hostelSelected;
      let messSelected = this.state.messSelected;

      for (let hostel of hostelSelected){
        if (hostelList.includes(hostel)){
          toast({
            type: "warning",
            title: `Hostel "${hostel}" is already present in your permissions`,
            animation: "fade up",
            time: 3000,
          });
        }
        else{
          toast({
            type: "success",
            title: `Successfully created permission for ${hostel}`,
            animation: "fade up",
            time: 3000,
          })
        }
      }
      if (messSelected === "no") {
        messSelected = "";
      }
      hostelSelected = [...hostelSelected, ...hostelList].filter(item => !item.endsWith("mess"));
      this.props.uploadHostelDetails(hostelSelected, messSelected);
    }
    this.closeModal();
  };

  componentDidMount() {
    this.props.getHostelOptions();
    this.props.getPermissionList();
  }

  render() {
    const { hostels, permissions } = this.props;
    if (hostels.isFetching | permissions.isFetching) {
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
          {permissions.data.results.length === 0 && 
            <div className={main["mess-select-form"]}> 
              <h3>Select the latest Hostel Mess you were dinning in before the COVID-19. Do not include the temporary mess you were dining in due to this pandemic.</h3>
              <div className={main["notif"]}>
                Note: Please select the options carefully, this field is non
                editable once submitted.
              </div>
              <Dropdown
                fluid
                selection
                value={this.state.messSelected}
                onChange={this.onChangeMessValue}
                search
                options={MessOptions(hostels.messOptions)}
              />
            </div>
          }
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
              <h3>
                Please make sure that you enter correct Bhawans and Mess details.
                Any changes once submitted shall not be entertained.
              </h3>
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
    permissions: state.getPermissionList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPermissionList: () => {
      dispatch(getPermissionList())
    },
    getHostelOptions: () => {
      dispatch(getHostelOptions());
    },
    uploadHostelDetails: (hostels, mess) => {
      dispatch(uploadHostelDetails(hostels, mess));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HostelUploads);
