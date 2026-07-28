<script lang="ts">
	let { data, form } = $props();
	let users = $derived(data.users || []);
	let filters = $derived(data.filters || {});
	let canManage = $derived(data.currentAdminRole === 'SUPER_ADMIN');
	let isCreateModalOpen = $state(false);
	let showCreatePassword = $state(false);
	let visiblePasswordFor = $state<Record<string, boolean>>({});
	let activeEditUser = $state<any | null>(null);
	let pendingDeleteUser = $state<null | { id: string; email: string; name: string }>(null);

	let totalUsers = $derived(users.length);
	let adminUsers = $derived(users.filter((user: any) => user.role !== 'CUSTOMER').length);
	let blockedUsers = $derived(users.filter((user: any) => user.isBlocked).length);

	const roleClass = (role: string) =>
		({
			SUPER_ADMIN: 'bg-black text-white',
			EDITOR: 'bg-blue-100 text-blue-800',
			CUSTOMER: 'bg-gray-100 text-gray-700'
		})[role] || 'bg-gray-100 text-gray-700';

	const displayName = (user: any) =>
		`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed user';

	const togglePassword = (id: string) => {
		visiblePasswordFor = {
			...visiblePasswordFor,
			[id]: !visiblePasswordFor[id]
		};
	};
</script>

<svelte:head>
	<title>Users | Abayiza Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl pb-12">
	<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="text-xs font-black tracking-[0.16em] text-blue-600 uppercase">Access Control</p>
			<h1 class="mt-1 text-3xl font-black text-gray-950">Users Management</h1>
			<p class="mt-2 text-sm text-gray-500">
				Create users, assign roles, block access, and reset passwords.
			</p>
		</div>
		{#if canManage}
			<button
				type="button"
				class="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-black text-white hover:bg-gray-800"
				onclick={() => (isCreateModalOpen = true)}
			>
				Add User
			</button>
		{/if}
	</div>

	{#if form?.error}
		<div
			class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
		>
			{form.error}
		</div>
	{/if}

	<div class="mb-6 grid gap-3 md:grid-cols-3">
		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-black tracking-[0.16em] text-gray-400 uppercase">Total Users</p>
			<p class="mt-2 text-2xl font-black text-gray-950">{totalUsers}</p>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-black tracking-[0.16em] text-gray-400 uppercase">Admin Access</p>
			<p class="mt-2 text-2xl font-black text-gray-950">{adminUsers}</p>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-black tracking-[0.16em] text-gray-400 uppercase">Blocked</p>
			<p class="mt-2 text-2xl font-black text-gray-950">{blockedUsers}</p>
		</div>
	</div>

	<form method="GET" class="rounded-t-2xl border-x border-t border-gray-200 bg-white p-4 shadow-sm">
		<div class="grid gap-3 md:grid-cols-[1fr_12rem_auto]">
			<input
				name="q"
				type="search"
				value={filters.q || ''}
				placeholder="Search name or email"
				class="rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
			/>
			<select
				name="role"
				class="rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
			>
				<option value="" selected={!filters.role}>All roles</option>
				<option value="SUPER_ADMIN" selected={filters.role === 'SUPER_ADMIN'}>Super admin</option>
				<option value="EDITOR" selected={filters.role === 'EDITOR'}>Editor</option>
				<option value="CUSTOMER" selected={filters.role === 'CUSTOMER'}>Customer</option>
			</select>
			<div class="flex gap-2">
				<button
					type="submit"
					class="rounded-md bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800"
					>Filter</button
				>
				<a
					href="/abayiza-secure-admin-7k9x2p/users"
					class="rounded-md border border-gray-300 px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
					>Clear</a
				>
			</div>
		</div>
	</form>

	<div class="overflow-x-auto rounded-b-2xl border border-gray-200 bg-white shadow-sm">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
						>User</th
					>
					<th class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
						>Role</th
					>
					<th class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
						>Status</th
					>
					<th class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
						>Orders</th
					>
					<th class="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-500 uppercase"
						>Password</th
					>
					<th class="px-6 py-3 text-right text-xs font-bold tracking-wider text-gray-500 uppercase"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each users as user}
					<tr class="align-top hover:bg-gray-50">
						<td class="px-6 py-4">
							<div class="font-bold text-gray-950">
								{displayName(user)}
								{#if user.isCurrentUser}
									<span
										class="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[0.65rem] font-black text-green-700"
										>You</span
									>
								{/if}
							</div>
							<div class="text-xs text-gray-500">{user.email}</div>
							<div class="mt-1 text-[0.7rem] text-gray-400">
								Joined {new Date(user.createdAt).toLocaleDateString()}
							</div>
						</td>
						<td class="px-6 py-4">
							<span class={`rounded-full px-2.5 py-1 text-xs font-black ${roleClass(user.role)}`}
								>{user.role}</span
							>
						</td>
						<td class="px-6 py-4">
							<span
								class={`rounded-full px-2.5 py-1 text-xs font-black ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
							>
								{user.isBlocked ? 'Blocked' : 'Active'}
							</span>
						</td>
						<td class="px-6 py-4 text-sm text-gray-600">{user.orderCount}</td>
						<td class="px-6 py-4 text-sm text-gray-600">{user.hasPassword ? 'Set' : 'Not set'}</td>
						<td class="px-6 py-4 text-right">
							{#if canManage}
								<div class="flex justify-end gap-2">
									<button
										type="button"
										class="rounded-md border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
										onclick={() => (activeEditUser = user)}
									>
										Edit
									</button>
									<button
										type="button"
										disabled={user.isCurrentUser}
										class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-45"
										onclick={() =>
											(pendingDeleteUser = {
												id: user.id,
												email: user.email,
												name: displayName(user)
											})}
									>
										Delete
									</button>
								</div>
								{#if user.isCurrentUser}
									<p class="mt-2 text-right text-xs text-gray-400">
										Current admin cannot be deleted.
									</p>
								{/if}
							{:else}
								<span class="text-xs text-gray-400">View only</span>
							{/if}
						</td>
					</tr>
				{/each}

				{#if users.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">No users found</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if isCreateModalOpen}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
			<div
				class="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
			>
				<div class="mb-5 flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-black tracking-[0.16em] text-blue-600 uppercase">New User</p>
						<h2 class="mt-1 text-2xl font-black text-gray-950">Add User</h2>
						<p class="mt-1 text-sm text-gray-500">
							Create customer or admin access from one simple form.
						</p>
					</div>
					<button
						type="button"
						aria-label="Close add user modal"
						class="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-black"
						onclick={() => (isCreateModalOpen = false)}
					>
						<svg
							class="h-5 w-5"
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>
				<form method="POST" action="?/create" class="space-y-4">
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">First Name</span>
							<input
								name="firstName"
								placeholder="First name"
								class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							/>
						</label>
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">Last Name</span>
							<input
								name="lastName"
								placeholder="Last name"
								class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							/>
						</label>
					</div>
					<label class="block">
						<span class="mb-1 block text-xs font-black text-gray-500 uppercase">Email</span>
						<input
							name="email"
							type="email"
							required
							placeholder="email@example.com"
							class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
						/>
					</label>
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">Role</span>
							<select
								name="role"
								class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							>
								<option value="CUSTOMER">Customer</option>
								<option value="EDITOR">Editor</option>
								<option value="SUPER_ADMIN">Super admin</option>
							</select>
						</label>
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">Password</span>
							<div class="relative">
								<input
									name="password"
									type={showCreatePassword ? 'text' : 'password'}
									minlength="8"
									placeholder="Password"
									class="w-full rounded-md border-gray-300 pr-11 text-sm focus:border-black focus:ring-black"
								/>
								<button
									type="button"
									aria-label={showCreatePassword ? 'Hide password' : 'Show password'}
									title={showCreatePassword ? 'Hide password' : 'Show password'}
									class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-black"
									onclick={() => (showCreatePassword = !showCreatePassword)}
								>
									{#if showCreatePassword}
										<svg
											class="h-4 w-4"
											aria-hidden="true"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.89 1 12a18.45 18.45 0 0 1 5.06-6.94"
											/>
											<path
												d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.11 11 8a18.5 18.5 0 0 1-2.16 3.19"
											/>
											<path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
											<path d="m1 1 22 22" />
										</svg>
									{:else}
										<svg
											class="h-4 w-4"
											aria-hidden="true"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									{/if}
								</button>
							</div>
						</label>
					</div>
					<label class="flex items-center gap-2 text-sm font-bold text-gray-700">
						<input
							name="isBlocked"
							type="checkbox"
							class="rounded border-gray-300 text-black focus:ring-black"
						/>
						Blocked
					</label>
					<div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
						<button
							type="button"
							class="rounded-full border border-gray-300 px-5 py-2 text-sm font-black text-gray-700 hover:bg-gray-50"
							onclick={() => (isCreateModalOpen = false)}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-full bg-black px-5 py-2 text-sm font-black text-white hover:bg-gray-800"
						>
							Create User
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if activeEditUser}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
			<div
				class="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
			>
				<div class="mb-5 flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-black tracking-[0.16em] text-blue-600 uppercase">Edit User</p>
						<h2 class="mt-1 text-2xl font-black text-gray-950">{displayName(activeEditUser)}</h2>
						<p class="mt-1 text-sm text-gray-500">{activeEditUser.email}</p>
					</div>
					<button
						type="button"
						aria-label="Close edit user modal"
						class="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-black"
						onclick={() => (activeEditUser = null)}
					>
						<svg
							class="h-5 w-5"
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>
				<form method="POST" action="?/update" class="space-y-4">
					<input type="hidden" name="id" value={activeEditUser.id} />
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">First Name</span>
							<input
								name="firstName"
								value={activeEditUser.firstName || ''}
								placeholder="First name"
								class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							/>
						</label>
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">Last Name</span>
							<input
								name="lastName"
								value={activeEditUser.lastName || ''}
								placeholder="Last name"
								class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							/>
						</label>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">Role</span>
							<select
								name="role"
								class="w-full rounded-md border-gray-300 text-sm focus:border-black focus:ring-black"
							>
								<option value="CUSTOMER" selected={activeEditUser.role === 'CUSTOMER'}
									>Customer</option
								>
								<option value="EDITOR" selected={activeEditUser.role === 'EDITOR'}>Editor</option>
								<option value="SUPER_ADMIN" selected={activeEditUser.role === 'SUPER_ADMIN'}
									>Super admin</option
								>
							</select>
						</label>
						<label class="block">
							<span class="mb-1 block text-xs font-black text-gray-500 uppercase">New Password</span
							>
							<div class="relative">
								<input
									name="password"
									type={visiblePasswordFor[activeEditUser.id] ? 'text' : 'password'}
									minlength="8"
									placeholder="Optional"
									class="w-full rounded-md border-gray-300 pr-11 text-sm focus:border-black focus:ring-black"
								/>
								<button
									type="button"
									aria-label={visiblePasswordFor[activeEditUser.id]
										? 'Hide password'
										: 'Show password'}
									title={visiblePasswordFor[activeEditUser.id] ? 'Hide password' : 'Show password'}
									class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-black"
									onclick={() => togglePassword(activeEditUser.id)}
								>
									{#if visiblePasswordFor[activeEditUser.id]}
										<svg
											class="h-4 w-4"
											aria-hidden="true"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.89 1 12a18.45 18.45 0 0 1 5.06-6.94"
											/>
											<path
												d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.11 11 8a18.5 18.5 0 0 1-2.16 3.19"
											/>
											<path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
											<path d="m1 1 22 22" />
										</svg>
									{:else}
										<svg
											class="h-4 w-4"
											aria-hidden="true"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									{/if}
								</button>
							</div>
						</label>
					</div>
					<label class="flex items-center gap-2 text-sm font-bold text-gray-700">
						<input
							name="isBlocked"
							type="checkbox"
							checked={activeEditUser.isBlocked}
							class="rounded border-gray-300 text-black focus:ring-black"
						/>
						Blocked
					</label>
					<div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
						<button
							type="button"
							class="rounded-full border border-gray-300 px-5 py-2 text-sm font-black text-gray-700 hover:bg-gray-50"
							onclick={() => (activeEditUser = null)}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-full bg-black px-5 py-2 text-sm font-black text-white hover:bg-gray-800"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if pendingDeleteUser}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
			<div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
				<p class="text-xs font-black tracking-[0.16em] text-red-600 uppercase">Delete User</p>
				<h2 class="mt-2 text-xl font-black text-gray-950">{pendingDeleteUser.name}</h2>
				<p class="mt-1 text-sm text-gray-500">{pendingDeleteUser.email}</p>
				<p class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
					This user will be removed from admin/user management. This action cannot be undone.
				</p>
				<div class="mt-5 flex justify-end gap-3">
					<button
						type="button"
						class="rounded-full border border-gray-300 px-5 py-2 text-sm font-black text-gray-700 hover:bg-gray-50"
						onclick={() => (pendingDeleteUser = null)}
					>
						Cancel
					</button>
					<form method="POST" action="?/delete">
						<input type="hidden" name="id" value={pendingDeleteUser.id} />
						<button
							type="submit"
							class="rounded-full bg-red-600 px-5 py-2 text-sm font-black text-white hover:bg-red-700"
						>
							Delete User
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
