// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
// import InputGroup from "../../components/form/form-elements/InputGroup";
// import DropzoneComponent from "../../components/form/form-elements/DropZone";
// import CheckboxComponents from "../../components/form/form-elements/CheckboxComponents";
// import RadioButtons from "../../components/form/form-elements/RadioButtons";
// import ToggleSwitch from "../../components/form/form-elements/ToggleSwitch";
// import FileInputExample from "../../components/form/form-elements/FileInputExample";
// import SelectInputs from "../../components/form/form-elements/SelectInputs";
// import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
// import InputStates from "../../components/form/form-elements/InputStates";
// import PageMeta from "../../components/common/PageMeta";

// export default function FormElements() {
//   return (
//     <div>
//       <PageMeta
//         title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <PageBreadcrumb pageTitle="Trainer Form" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//         <div className="space-y-6">
//           <DefaultInputs />
//           <SelectInputs />
//           <TextAreaInput />
//           <InputStates />
//         </div>
//         <div className="space-y-6">
//           <InputGroup />
//           <FileInputExample />
//           <CheckboxComponents />
//           <RadioButtons />
//           <ToggleSwitch />
//           <DropzoneComponent />
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/trainer/TrainerRegisterForm.tsx
import { useState } from "react";
// import Input from "../input/InputField";
// import Radio from "../input/Radio";
// import Checkbox from "../input/Checkbox";
// import Label from "../Label";
// import Form from "../Form";
// import FileInput from "../input/FileInput";
// import PhoneInput from "../group-input/PhoneInput";
import Input from "../../components/form/input/InputField";
import Form from "../../components/form/Form";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import Radio from "../../components/form/input/Radio";
import FileInput from "../../components/form/input/FileInput";
import Checkbox from "../../components/form/input/Checkbox";
import Label from "../../components/form/Label";
import { registerTrainer } from "./trainerformapi";
import DatePicker from "../../components/form/date-picker";


const TrainerRegisterForm = () => {
const [fullName, setFullName] = useState("");

const [email, setEmail] = useState("");
const [mobileNo, setMobileNo] = useState("");
const [dob, setDob] = useState("");
const [gender, setGender] = useState("Female");

const [add1, setAdd1] = useState("");
const [add2, setAdd2] = useState("");
const [taluka, setTaluka] = useState("");
const [dist, setDist] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");

const [highestQualification, setHighestQualification] = useState("");
const [specializations, setSpecializations] = useState<string[]>([]);
const [collegeName, setCollegeName] = useState("");
const [totalExperience, setTotalExperience] = useState("");
const [subjectExperience, setSubjectExperience] = useState<string[]>([]);

const [workingDays, setWorkingDays] = useState<string[]>([]);
const [weeklyOff, setWeeklyOff] = useState<string[]>([]);
const [customTiming, setCustomTiming] = useState("");

const [linkedinProfile, setLinkedinProfile] = useState("");
const [password, setPassword] = useState("");

// Files
const [resume, setResume] = useState<File | null>(null);
const [idProofTrainer, setIdProofTrainer] = useState<File | null>(null);
const [profilePhotoTrainer, setProfilePhotoTrainer] = useState<File | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();

  // Basic Fields
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("mobileNo", mobileNo);
  formData.append("dob", dob);
  formData.append("gender", gender);
  formData.append("highestQualification", highestQualification);
  formData.append("collegeName", collegeName);
  formData.append("totalExperience", totalExperience);
  formData.append("linkedinProfile", linkedinProfile);
  formData.append("password", password);

  // Address
  formData.append("address[add1]", add1);
  formData.append("address[add2]", add2);
  formData.append("address[taluka]", taluka);
  formData.append("address[dist]", dist);
  formData.append("address[state]", state);
  formData.append("address[pincode]", pincode);

  // Array Fields
  specializations.forEach((spec) => formData.append("specializations[]", spec));
  subjectExperience.forEach((exp) => formData.append("subjectExperience[]", exp));

  // Available Timing
  workingDays.forEach((day) =>
    formData.append("availableTiming[workingDays][]", day)
  );
  weeklyOff.forEach((off) =>
    formData.append("availableTiming[weeklyOff][]", off)
  );
  formData.append("availableTiming[custom]", customTiming);

  // Files
  if (resume) formData.append("resume", resume);
  if (idProofTrainer) formData.append("idProofTrainer", idProofTrainer);
  if (profilePhotoTrainer) formData.append("profilePhotoTrainer", profilePhotoTrainer);

  try {
    const res = await registerTrainer(formData);
    alert("Trainer registered successfully!");
    console.log(res);
  } catch (err: any) {
    alert(err?.message || "Something went wrong");
    console.error(err);
  }
};
  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setSelected: (val: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

//   return (
//     <Form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow border">
//       <h2 className="text-xl font-semibold text-center text-gray-800">Trainer Registration</h2>

//       <div>
//         <Label>Full Name</Label>
//         <Input name="fullName" placeholder="Ashwini Mokate" />
//       </div>

//       <div>
//         <Label>Email</Label>
//         <Input name="email" type="email" placeholder="ashwini@example.com" />
//       </div>

//       <div>
//         <Label>Phone Number</Label>
//         <PhoneInput
//           countries={[{ code: "IN", label: "+91" }]}
//           onChange={(val) => console.log(val)}
//           placeholder="+91 9876543210"
//           selectPosition="start"
//         />
//       </div>

//       <div>
//         <Label>Date of Birth</Label>
//         <Input name="dob" type="date" />
//       </div>

//       <div>
//         <Label>Gender</Label>
//         <div className="flex gap-4">
//           {['Female', 'Male', 'Other'].map((g) => (
//             <Radio
//               key={g}
//               id={`gender-${g}`}
//               name="gender"
//               value={g}
//               label={g}
//               checked={gender === g}
//               onChange={setGender}
//             />
//           ))}
//         </div>
//       </div>

//       <div>
//         <Label>Address</Label>
//         <div className="grid grid-cols-2 gap-4">
//           <Input name="add1" placeholder="Flat No. 5" />
//           <Input name="add2" placeholder="Sukhniwas Society" />
//           <Input name="taluka" placeholder="Karjat" />
//           <Input name="dist" placeholder="Ahmednagar" />
//           <Input name="state" placeholder="Maharashtra" />
//           <Input name="pincode" type="number" placeholder="414402" />
//         </div>
//       </div>

//       <div>
//         <Label>Highest Qualification</Label>
//         <Input name="highestQualification" placeholder="M.Tech" />
//       </div>

//       <div>
//         <Label>Specializations</Label>
//         <Input
//   name="specializations"
//   placeholder="Computer Engineering, AI"
//   onChange={(e) => setSpecializations(e.target.value.split(",").map(s => s.trim()))}
// />
//       </div>

//       <div>
//         <Label>College Name</Label>
//         <Input name="collegeName" placeholder="MIT College Pune" />
//       </div>

//       <div>
//         <Label>Total Experience (in years)</Label>
//         <Input name="totalExperience" type="number" placeholder="5" />
//       </div>

//       <div>
//         <Label>Subject Experience</Label>
       
// <Input
//   name="subjectExperience"
//   placeholder="Data Structures, AI"
//   onChange={(e) => setSubjectExperience(e.target.value.split(",").map(s => s.trim()))}
// />
//       </div>

//       <div>
//         <Label>Resume</Label>
//         <FileInput onChange={(e) => console.log(e.target.files?.[0])} />
//       </div>

//       <div>
//         <Label>ID Proof</Label>
//         <FileInput onChange={(e) => console.log(e.target.files?.[0])} />
//       </div>

//       <div>
//         <Label>Available Timings</Label>
//         <div>
//           <p className="text-sm font-medium text-gray-700">Working Days</p>
//           <div className="flex flex-wrap gap-3">
//             {['Mon-Fri', 'Mon-Sat', 'Tue-Sun'].map((day) => (
//               <Checkbox
//                 key={day}
//                 label={day}
//                 checked={workingDays.includes(day)}
//                 onChange={() => handleCheckboxChange(day, workingDays, setWorkingDays)}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="mt-4">
//           <p className="text-sm font-medium text-gray-700">Weekly Off</p>
//           <div className="flex flex-wrap gap-3">
//             {['Saturday', 'Sunday'].map((off) => (
//               <Checkbox
//                 key={off}
//                 label={off}
//                 checked={weeklyOff.includes(off)}
//                 onChange={() => handleCheckboxChange(off, weeklyOff, setWeeklyOff)}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="mt-4">
//           <Label>Custom Timing</Label>
//           <Input name="custom" placeholder="10am - 5pm" />
//         </div>
//       </div>

//       <div>
//         <Label>LinkedIn Profile</Label>
//         <Input
//           name="linkedinProfile"
//           placeholder="https://www.linkedin.com/in/ashwini-mokate"
//         />
//       </div>

//       <div>
//         <Label>Password</Label>
//         <Input type="password" name="password" placeholder="••••••" />
//       </div>

//       <div>
//   <Label>Profile Photo</Label>
//   <FileInput onChange={(e) => setProfilePhotoTrainer(e.target.files?.[0] || null)} />
// </div>




//       <button
//         type="submit"
//         className="w-full py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
//       >
//         Register Trainer
//       </button>
//     </Form>
//   );
return (
  <Form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl border border-gray-200"
  >
    <h2 className="text-2xl font-bold text-center text-indigo-700 tracking-wide">
      🧑‍🏫 Trainer Registration
    </h2>

    {/* Name */}
    <div className="grid grid-cols-1">
      <Label>Full Name</Label>
      <Input name="fullName" placeholder="Ashwini Mokate" />
    </div>

    {/* Email + Phone */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="ashwini@example.com" />
      </div>
      <div>
        <Label>Phone Number</Label>
        <PhoneInput
          countries={[{ code: "IN", label: "+91" }]}
          onChange={(val) => console.log(val)}
          placeholder="+91 9876543210"
          selectPosition="start"
        />
      </div>
    </div>

    {/* DOB + Gender */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
  <DatePicker
    id="dob"
    label="Date of Birth"
    placeholder="Select your DOB"
    mode="single"
    onChange={([selectedDate]) => {
      console.log("DOB selected:", selectedDate);
    }}
  />
</div>


      <div>
        <Label>Gender</Label>
        <div className="flex gap-6 mt-2">
          {['Female', 'Male', 'Other'].map((g) => (
            <Radio
              key={g}
              id={`gender-${g}`}
              name="gender"
              value={g}
              label={g}
              checked={gender === g}
              onChange={setGender}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Address */}
    <div>
      <Label>Address</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="add1" placeholder="Flat No. 5" />
        <Input name="add2" placeholder="Sukhniwas Society" />
        <Input name="taluka" placeholder="Taluka" />
        <Input name="dist" placeholder="District" />
        <Input name="state" placeholder="State" />
        <Input name="pincode" type="number" placeholder="Pincode" />
      </div>
    </div>

    {/* Education */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Highest Qualification</Label>
        <Input name="highestQualification" placeholder="M.Tech" />
      </div>
      <div>
        <Label>College Name</Label>
        <Input name="collegeName" placeholder="MIT College Pune" />
      </div>
    </div>

    {/* Specializations */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Specializations</Label>
        <Input
          name="specializations"
          placeholder="Computer Engineering, AI"
          onChange={(e) =>
            setSpecializations(e.target.value.split(",").map((s) => s.trim()))
          }
        />
      </div>
      <div>
        <Label>Subject Experience</Label>
        <Input
          name="subjectExperience"
          placeholder="Data Structures, AI"
          onChange={(e) =>
            setSubjectExperience(e.target.value.split(",").map((s) => s.trim()))
          }
        />
      </div>
    </div>

    {/* Experience */}
    <div>
      <Label>Total Experience (in years)</Label>
      <Input name="totalExperience" type="number" placeholder="5" />
    </div>

    {/* Files */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Resume</Label>
        <FileInput onChange={(e) => console.log(e.target.files?.[0])} />
      </div>
      <div>
        <Label>ID Proof</Label>
        <FileInput onChange={(e) => console.log(e.target.files?.[0])} />
      </div>
    </div>

    {/* Availability */}
    <div>
      <Label>Available Timings</Label>
      <div className="mt-2 space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Working Days</p>
          <div className="flex flex-wrap gap-3 mt-1">
            {["Mon-Fri", "Mon-Sat", "Tue-Sun"].map((day) => (
              <Checkbox
                key={day}
                label={day}
                checked={workingDays.includes(day)}
                onChange={() =>
                  handleCheckboxChange(day, workingDays, setWorkingDays)
                }
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Weekly Off</p>
          <div className="flex flex-wrap gap-3 mt-1">
            {["Saturday", "Sunday"].map((off) => (
              <Checkbox
                key={off}
                label={off}
                checked={weeklyOff.includes(off)}
                onChange={() =>
                  handleCheckboxChange(off, weeklyOff, setWeeklyOff)
                }
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Custom Timing</Label>
          <Input name="custom" placeholder="10am - 5pm" />
        </div>
      </div>
    </div>

    {/* LinkedIn + Password */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>LinkedIn Profile</Label>
        <Input
          name="linkedinProfile"
          placeholder="https://www.linkedin.com/in/ashwini-mokate"
        />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" name="password" placeholder="••••••" />
      </div>
    </div>

    {/* Profile Image */}
    <div>
      <Label>Profile Photo</Label>
      <FileInput
        onChange={(e) =>
          setProfilePhotoTrainer(e.target.files?.[0] || null)
        }
      />
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300"
      >
        Register Trainer
      </button>
    </div>
  </Form>
);


};

export default TrainerRegisterForm;
