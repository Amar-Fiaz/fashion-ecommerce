import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import AddressForm from "../features/user/AddressForm";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "../features/user/userApi";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

function ProfilePage() {
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: savingProfile }] =
    useUpdateProfileMutation();

  const { data: addressesData, isLoading: addressesLoading } =
    useGetAddressesQuery();
  const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updatingAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(nameSchema),
    values: profileData?.user ? { name: profileData.user.name } : undefined,
  });

  const [nameSaveStatus, setNameSaveStatus] = useState(null);

  const onSaveName = async (data) => {
    setNameSaveStatus(null);
    try {
      await updateProfile(data).unwrap();
      setNameSaveStatus("success");
    } catch {
      setNameSaveStatus("error");
    }
  };

  const addresses = addressesData?.addresses || [];
  const editingAddress = addresses.find((a) => a._id === editingAddressId);

  return (
    <Container className="py-8 max-w-xl">
      <h1 className="text-2xl font-bold text-black mb-6">My Profile</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-black mb-3">
          Account details
        </h2>
        {profileLoading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSaveName)}
            className="flex flex-col gap-3"
          >
            <Input
              id="name"
              label="Name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="email"
              label="Email"
              value={profileData?.user?.email || ""}
              disabled
            />
            <Button
              type="submit"
              variant="primary"
              disabled={savingProfile}
              className="w-fit"
            >
              {savingProfile ? "Saving..." : "Save changes"}
            </Button>
            {nameSaveStatus === "success" && (
              <p className="text-sm text-success">Saved successfully.</p>
            )}
            {nameSaveStatus === "error" && (
              <p className="text-sm text-error">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-black">Saved addresses</h2>
          {!showAddForm && (
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddForm(true);
                setEditingAddressId(null);
              }}
            >
              Add address
            </Button>
          )}
        </div>

        {addressesLoading && <p className="text-neutral-500">Loading...</p>}

        {showAddForm && (
          <div className="border border-neutral-200 rounded-md p-4 mb-4">
            <AddressForm
              isSubmitting={addingAddress}
              onCancel={() => setShowAddForm(false)}
              onSubmit={async (data) => {
                await addAddress(data);
                setShowAddForm(false);
              }}
            />
          </div>
        )}

        {editingAddress && (
          <div className="border border-neutral-200 rounded-md p-4 mb-4">
            <AddressForm
              initialValues={editingAddress}
              isSubmitting={updatingAddress}
              onCancel={() => setEditingAddressId(null)}
              onSubmit={async (data) => {
                await updateAddress({ addressId: editingAddress._id, ...data });
                setEditingAddressId(null);
              }}
            />
          </div>
        )}

        {!addressesLoading && addresses.length === 0 && !showAddForm && (
          <p className="text-neutral-500">No saved addresses yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="border border-neutral-200 rounded-md p-4 flex items-start justify-between gap-4"
            >
              <div className="text-sm text-neutral-800">
                {address.label && (
                  <p className="font-medium text-black">{address.label}</p>
                )}
                <p>{address.fullName}</p>
                <p>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p>
                  {address.city}
                  {address.state ? `, ${address.state}` : ""}{" "}
                  {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.isDefault && (
                  <p className="text-xs text-accent mt-1">Default address</p>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  className="text-sm text-neutral-500 hover:text-black"
                  onClick={() => {
                    setEditingAddressId(address._id);
                    setShowAddForm(false);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-sm text-error hover:opacity-80"
                  onClick={() => deleteAddress(address._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

export default ProfilePage;
