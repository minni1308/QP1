// mcqEditComponent.js
import React, { Component } from 'react';
import { Alert, Button, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { fetchSubjects, fetchQuestions, updateQuestions } from '../ActionCreators'; // Assuming these might need updates or new ones created
import { baseUrl } from '../../shared/baseUrl';
import localStorage from 'local-storage';
import { WaveTopBottomLoading } from 'react-loadingg';

class McqEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: [],
            options: [],
            isModalOpen: false,
            isRemove: false,
            isLoading: false,
            id: '',
            unit: '',
            subject: '',
            errmsg: '',
            succmsg: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleRemove = this.toggleRemove.bind(this);
        this.addFormClick = this.addFormClick.bind(this);
        this.removeFormClick = this.removeFormClick.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.clear = this.clear.bind(this);
        this.fetchMcqs = this.fetchMcqs.bind(this);
    }

    componentDidMount() {
        fetchSubjects()
            .then(res => res.json())
            .then(opts => {
                if (opts.success) {
                    const options = opts.list.map(opt => ({ value: opt.code, label: opt.name, id: opt._id }));
                    this.setState({ options: options });
                } else {
                    this.setState({ errmsg: opts.message || 'Could not fetch subjects' });
                }
            })
            .catch(err => {
                this.setState({ errmsg: 'Could not fetch subjects: ' + err.message });
            });
    }

    getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.get('token')}`
    });

    // Fetch MCQs for selected subject and unit
    fetchMcqs() {
        if (!this.state.id || !this.state.unit) {
            this.setState({ errmsg: 'Please select subject and unit first' });
            return;
        }
        this.setState({ isLoading: true, errmsg: '', succmsg: '', question: [] });
        fetch(`${baseUrl}teacher/mcq/get`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ id: this.state.id, unit: this.state.unit })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const questions = data.map(q => ({ 
                        name: q.name || '', 
                        options: q.options || ['', '', '', ''],
                        _id: q._id // Keep track of original ID if needed for updates, though current PUT replaces all
                    }));
                    this.setState({ question: questions.length > 0 ? questions : [{ name: '', options: ['', '', '', ''] }], isLoading: false });
                } else {
                    throw new Error('Invalid data format received');
                }
            })
            .catch(err => {
                this.setState({ errmsg: 'Error fetching MCQs: ' + err.message, isLoading: false });
            });
    }

    // Handle input changes for question text and options
    handleInput(i, e, type, optIndex = null) {
        let question = [...this.state.question];
        if (type === 'name') {
            question[i].name = e.target.value;
        } else if (type === 'option') {
            question[i].options[optIndex] = e.target.value;
        }
        this.setState({ question });
    }

    // Add a new blank MCQ form
    addFormClick() {
        this.setState(prevState => ({
            question: [...prevState.question, { name: '', options: ['', '', '', ''] }]
        }));
    }

    // Remove an MCQ form
    removeFormClick(i) {
        let question = [...this.state.question];
        question.splice(i, 1);
        if (question.length === 0) { // Ensure at least one form is always present
            question = [{ name: '', options: ['', '', '', ''] }];
        }
        this.setState({ question });
    }

    // Submit updated MCQs
    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.id || !this.state.unit) {
            this.setState({ errmsg: 'Please select subject and unit' });
            return;
        }
        // Filter out empty questions/options before submitting
        const validQuestions = this.state.question.filter(
            q => q.name.trim() !== '' && q.options.every(opt => opt.trim() !== '')
        ).map(q => ({ name: q.name, options: q.options })); // Only send needed data

        if (validQuestions.length === 0) {
            this.setState({ errmsg: 'Please enter at least one valid MCQ with all options filled.'});
            return;
        }

        this.setState({ isLoading: true, errmsg: '', succmsg: '' });

        fetch(`${baseUrl}teacher/mcq/put`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ id: this.state.id, unit: this.state.unit, mcq: validQuestions })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errData => { 
                        throw new Error(errData.message || `HTTP error! status: ${res.status}`); 
                    });
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    this.setState({ succmsg: 'MCQs updated successfully!', isLoading: false });
                    // Optionally re-fetch to show the updated list
                    // this.fetchMcqs(); 
                } else {
                    throw new Error(data.message || 'Update failed');
                }
            })
            .catch(err => {
                this.setState({ errmsg: 'Error updating MCQs: ' + err.message, isLoading: false });
            });
    }

    // Utility functions (toggleModal, toggleRemove, handleDelete, clear)
    toggleModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    toggleRemove() {
        this.setState({ isRemove: !this.state.isRemove });
    }

    handleDelete() {
        // Implement if separate delete functionality is needed, currently PUT replaces all
        console.log("Delete action triggered - currently handled by PUT");
        this.toggleRemove();
        // Potentially call PUT with an empty array if you want to delete all
        // fetch(`${baseUrl}teacher/mcq/put`, { ... body: { id: this.state.id, unit: this.state.unit, mcq: [] } ... });
    }

    clear() {
        this.setState({ question: [{ name: '', options: ['', '', '', ''] }], id: '', unit: '', subject: '', errmsg: '', succmsg: '' });
    }

    render() {
        if (this.state.isLoading) {
            return <WaveTopBottomLoading />;
        }
        return (
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <Label>Subject</Label>
                        <Select
                            options={this.state.options}
                            value={this.state.subject}
                            onChange={(selectedOption) => this.setState({ subject: selectedOption, id: selectedOption.id }, this.fetchMcqs)}
                            placeholder="Select Subject"
                        />
                    </div>
                    <div className="col-md-4">
                        <Label>Unit</Label>
                        <Input type="select" value={this.state.unit} onChange={(e) => this.setState({ unit: e.target.value }, this.fetchMcqs)}>
                            <option value="">Select Unit</option>
                            <option value="u1">Unit 1</option>
                            <option value="u2">Unit 2</option>
                            <option value="u3">Unit 3</option>
                            <option value="u4">Unit 4</option>
                            <option value="u5">Unit 5</option>
                        </Input>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <Button color="secondary" onClick={this.clear} block>Clear Selection</Button>
                    </div>
                </div>

                {this.state.errmsg && <Alert color="danger">{this.state.errmsg}</Alert>}
                {this.state.succmsg && <Alert color="success">{this.state.succmsg}</Alert>}
                
                {this.state.id && this.state.unit && (
                    <form onSubmit={this.handleSubmit}>
                        {this.state.question.map((el, i) => (
                            <div key={i} className="mcq-edit-group mb-4 p-3 border rounded">
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Question {i + 1}</Label>
                                            <Input
                                                type="textarea"
                                                placeholder="Enter MCQ question text"
                                                value={el.name}
                                                required
                                                onChange={(e) => this.handleInput(i, e, 'name')}
                                                className="mb-2"
                                                rows={2}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {['A', 'B', 'C', 'D'].map((optLetter, optIndex) => (
                                        <Col md={6} key={optLetter}>
                                            <FormGroup>
                                                <Label>Option {optLetter}</Label>
                                                <Input
                                                    type="text"
                                                    placeholder={`Option ${optLetter}`}
                                                    value={el.options[optIndex]}
                                                    required
                                                    onChange={(e) => this.handleInput(i, e, 'option', optIndex)}
                                                />
                                            </FormGroup>
                                        </Col>
                                    ))}
                                </Row>
                                <Row>
                                    <Col className="text-right">
                                        <Button color="danger" size="sm" onClick={() => this.removeFormClick(i)}>Remove MCQ</Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <Row className="mt-3">
                            <Col md={4}>
                                <Button type="button" color="primary" onClick={this.addFormClick} block>Add Another MCQ</Button>
                            </Col>
                            <Col md={4}>
                                <Button type="submit" color="success" block>Save Changes</Button>
                            </Col>
                            <Col md={4}>
                                <Button type="button" color="warning" onClick={this.toggleRemove} block disabled={this.state.question.length === 1 && this.state.question[0].name === ''}>Delete All Teacher MCQs</Button>
                            </Col>
                        </Row>
                    </form>
                )}

                {/* Delete Confirmation Modal */}
                <Modal isOpen={this.state.isRemove} toggle={this.toggleRemove}>
                    <ModalHeader toggle={this.toggleRemove}>Confirm Deletion</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete all MCQs you added for {this.state.subject?.label} - Unit {this.state.unit?.substring(1)}? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleRemove}>Cancel</Button>
                        <Button color="danger" onClick={this.handleDelete}>Delete All My MCQs</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default McqEdit; 