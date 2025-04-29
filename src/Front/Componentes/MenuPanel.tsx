import React from 'react';
import { Modal, Flex, Card, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Dia {
  Id_Desayuno: number;
  Desayuno: string;
  Id_Comer: number;
  Comer: string;
  Id_Cena: number;
  Cena: string;
}

interface WeeklyMenuModalProps {
  visible: boolean;
  onClose: () => void;
  dias: Dia[];
}

const diasSemana = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 
  'Viernes', 'Sábado', 'Domingo'
];

const WeeklyMenuModal: React.FC<WeeklyMenuModalProps> = ({ visible, onClose, dias }) => {
  return (
    <Modal
      title="Plan Semanal de Menús"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Flex wrap="wrap" gap="middle" justify="center">
        {dias.map((dia, index) => (
          <Card
            key={index}
            title={diasSemana[index]}
            style={{ width: 200, marginBottom: 16 }}
            actions={[<Text>Edit</Text>]}
          >
            <Flex vertical gap="small">
              <Flex align="center" gap="small">
                <StarOutlined />
                <Text>{dia.Desayuno}</Text>
              </Flex>
              <Text type="secondary">Desayuno</Text>

              <Flex align="center" gap="small">
                <StarOutlined />
                <Text>{dia.Comer}</Text>
              </Flex>
              <Text type="secondary">Comida</Text>

              <Flex align="center" gap="small">
                <StarOutlined />
                <Text>{dia.Cena}</Text>
              </Flex>
              <Text type="secondary">Cena</Text>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Modal>
  );
};

export default WeeklyMenuModal;