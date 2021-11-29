import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { api } from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Foods {
	id: number;
	name: string;
	description: string;
	price: number;
	available: boolean;
	image: string;
}

interface DashboardProps {
	toggleModal: () => void;
	toggleEditModal: () => void;
	handleEditFood: (food: Foods) => void;
}

interface AddFoodProps {
	image: string;
	name: string;
	placeholder: string;
	price: number;
	description: string;
}

export function Dashboard({
	toggleModal,
	toggleEditModal,
	handleEditFood,
}: DashboardProps) {
	const [foods, setFoods] = useState<Foods[]>([]);
	const [editingFood, setEditingFood] = useState<Foods>({} as Foods);
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	useEffect(() => {
		async function getFood() {
			const response = await api.get('/foods');
			setFoods(response.data);
		}
		getFood();
	}, [foods]);

	const handleAddFood = async (food: AddFoodProps): Promise<void> => {
		try {
			const response = await api.post('/foods', {
				...food,
				available: true,
			});

			setFoods([...foods, ...response.data]);
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpdateFood = async (food: AddFoodProps): Promise<void> => {
		try {
			const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
				...editingFood,
				...food,
			});

			const foodsUpdated = foods.map(f =>
				f.id !== foodUpdated.data.id ? f : foodUpdated.data
			);

			setFoods(foodsUpdated);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeleteFood = async (id: number): Promise<void> => {
		await api.delete(`/foods/${id}`);

		const foodsFiltered = foods.filter(food => food.id !== id);

		setFoods(foodsFiltered);
	};

	toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	toggleEditModal = () => {
		setEditModalOpen(!editModalOpen);
	};

	handleEditFood = (food: Foods) => {
		setEditingFood(food);
		setEditModalOpen(true);
	};

	return (
		<>
			<Header openModal={toggleModal} />
			<ModalAddFood
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				handleAddFood={handleAddFood}
			/>
			<ModalEditFood
				isOpen={editModalOpen}
				setIsOpen={toggleEditModal}
				editingFood={editingFood}
				handleUpdateFood={handleUpdateFood}
			/>

			<FoodsContainer data-testid="foods-list">
				{foods &&
					foods.map(food => (
						<Food
							key={food.id}
							food={food}
							handleDelete={handleDeleteFood}
							handleEditFood={handleEditFood}
						/>
					))}
			</FoodsContainer>
		</>
	);
}
